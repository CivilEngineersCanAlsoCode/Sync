# Multi-Provider AI Architecture

## Overview

**Goal:** Support multiple AI providers (Gemini, OpenAI, Local Llama) with seamless switching via configuration.

**Benefits:**

- ✅ **Offline-First:** Use local Llama when internet is unavailable
- ✅ **Cost Control:** Switch to free/local models to avoid API costs
- ✅ **Privacy:** Keep sensitive resumes fully local with Llama
- ✅ **Fallback:** If one provider fails, automatically try another
- ✅ **Flexibility:** Easy to add new providers (Claude, Mixtral, etc.)

---

## Architecture Design

### Provider Abstraction Layer

````python
# backend/app/services/ai_provider.py

from abc import ABC, abstractmethod
from typing import Dict, Any
import os

class AIProvider(ABC):
    """Base class for all AI providers"""

    @abstractmethod
    def extract_resume_data(self, resume_text: str) -> Dict[str, Any]:
        """Extract structured data from resume text"""
        pass

    @abstractmethod
    def is_available(self) -> bool:
        """Check if provider is configured and reachable"""
        pass


class GeminiProvider(AIProvider):
    """Google Gemini API provider"""

    def __init__(self):
        from google import genai
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    def extract_resume_data(self, resume_text: str) -> Dict[str, Any]:
        prompt = self._build_prompt(resume_text)
        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt
        )
        return self._parse_response(response.text)

    def is_available(self) -> bool:
        return bool(os.getenv("GEMINI_API_KEY"))

    def _build_prompt(self, text: str) -> str:
        return f"""Extract projects, experience, and skills from this resume.
        Return ONLY valid JSON:
        {{"projects": [...], "experience": [...], "skills": [...]}}

        Resume: {text}"""

    def _parse_response(self, response_text: str) -> dict:
        import json
        # Remove markdown code blocks
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0]
        return json.loads(response_text.strip())


class OpenAIProvider(AIProvider):
    """OpenAI API provider"""

    def __init__(self):
        from openai import OpenAI
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    def extract_resume_data(self, resume_text: str) -> Dict[str, Any]:
        prompt = self._build_prompt(resume_text)
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)

    def is_available(self) -> bool:
        return bool(os.getenv("OPENAI_API_KEY"))

    def _build_prompt(self, text: str) -> str:
        return f"""Extract projects, experience, and skills from this resume.
        Return ONLY valid JSON:
        {{"projects": [...], "experience": [...], "skills": [...]}}

        Resume: {text}"""


class LocalLlamaProvider(AIProvider):
    """Local Llama model via Ollama"""

    def __init__(self):
        import requests
        self.base_url = os.getenv("OLLAMA_URL", "http://localhost:11434")
        self.model = os.getenv("LLAMA_MODEL", "llama3:3b")

    def extract_resume_data(self, resume_text: str) -> Dict[str, Any]:
        import requests
        prompt = self._build_prompt(resume_text)

        response = requests.post(
            f"{self.base_url}/api/generate",
            json={
                "model": self.model,
                "prompt": prompt,
                "format": "json",  # Force JSON output
                "stream": False
            }
        )

        result = response.json()
        return self._parse_response(result['response'])

    def is_available(self) -> bool:
        try:
            import requests
            response = requests.get(f"{self.base_url}/api/tags", timeout=2)
            return response.status_code == 200
        except:
            return False

    def _build_prompt(self, text: str) -> str:
        return f"""Extract projects, experience, and skills from this resume.
        Return ONLY valid JSON without any explanation:
        {{"projects": [...], "experience": [...], "skills": [...]}}

        Resume: {text}"""

    def _parse_response(self, response_text: str) -> dict:
        import json
        # Llama sometimes adds explanation, extract JSON
        if "{" in response_text:
            json_start = response_text.index("{")
            json_end = response_text.rindex("}") + 1
            response_text = response_text[json_start:json_end]
        return json.loads(response_text.strip())
````

---

### Provider Factory

```python
# backend/app/services/ai_factory.py

from .ai_provider import GeminiProvider, OpenAIProvider, LocalLlamaProvider
import os

class AIProviderFactory:
    """Factory to get the configured AI provider"""

    @staticmethod
    def get_provider():
        """Get AI provider based on environment config"""
        provider_name = os.getenv("AI_PROVIDER", "gemini").lower()

        providers = {
            "gemini": GeminiProvider,
            "openai": OpenAIProvider,
            "llama": LocalLlamaProvider,
            "local": LocalLlamaProvider,  # Alias
        }

        provider_class = providers.get(provider_name)
        if not provider_class:
            raise ValueError(f"Unknown AI provider: {provider_name}")

        provider = provider_class()

        # Check if provider is available
        if not provider.is_available():
            print(f"⚠️  Provider '{provider_name}' not available, trying fallback...")
            return AIProviderFactory._get_fallback_provider(provider_name)

        return provider

    @staticmethod
    def _get_fallback_provider(failed_provider: str):
        """Try fallback providers in order"""
        fallback_order = ["gemini", "llama", "openai"]

        # Remove the failed one
        if failed_provider in fallback_order:
            fallback_order.remove(failed_provider)

        for name in fallback_order:
            try:
                provider_class = {
                    "gemini": GeminiProvider,
                    "openai": OpenAIProvider,
                    "llama": LocalLlamaProvider
                }[name]

                provider = provider_class()
                if provider.is_available():
                    print(f"✅ Using fallback provider: {name}")
                    return provider
            except Exception as e:
                print(f"❌ Fallback {name} failed: {e}")
                continue

        raise RuntimeError("No AI providers available. Configure at least one.")
```

---

### Usage in Story 3.2

```python
# backend/app/api/routes/resumes.py

from app.services.ai_factory import AIProviderFactory

@router.post("/resumes/{resume_id}/extract")
async def extract_resume_ai(
    resume_id: int,
    current_user: User = Depends(get_current_user)
):
    # Get resume from database
    resume = session.get(Resume, resume_id)

    if not resume or resume.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Resume not found")

    try:
        # Get configured provider (Gemini, OpenAI, or Local Llama)
        ai_provider = AIProviderFactory.get_provider()

        # Extract structured data
        extracted_data = ai_provider.extract_resume_data(resume.raw_text)

        # Save to database
        resume.projects = extracted_data.get("projects", [])
        resume.experience = extracted_data.get("experience", [])
        resume.skills = extracted_data.get("skills", [])
        session.commit()

        return {
            "message": "Resume successfully extracted!",
            "data": extracted_data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": "AI se resume parse nahi ho pa raha", "code": "AI_PARSE_ERROR"}
        )
# Is endpoint se AI (Gemini/OpenAI/Llama) resume ka data extract karta hai
```

---

## Configuration (.env)

```bash
# AI Provider Selection (gemini, openai, or llama)
AI_PROVIDER=gemini  # Change to "llama" for local model

# Gemini Configuration
GEMINI_API_KEY=AIzaSyBagna_Flw5iLrjMqN4oGydMLcGNkxkcEY
GEMINI_MODEL=gemini-2.5-flash

# OpenAI Configuration (optional)
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o-mini

# Local Llama Configuration via Ollama
OLLAMA_URL=http://localhost:11434
LLAMA_MODEL=llama3:3b  # Your 3B parameter model
```

---

## Setting Up Local Llama (Ollama)

### 1. Install Ollama

```bash
# macOS (Apple Silicon)
brew install ollama

# Start Ollama service
ollama serve
```

### 2. Pull Llama 3 Model

```bash
# Download Llama 3 8B (or use your existing 3B model)
ollama pull llama3:3b

# Verify it's working
ollama run llama3:3b "Hello, test message"
```

### 3. Test Connection

```bash
# Test Ollama API
curl http://localhost:11434/api/tags

# Expected response: List of downloaded models
```

### 4. Update .env

```bash
AI_PROVIDER=llama
OLLAMA_URL=http://localhost:11434
LLAMA_MODEL=llama3:3b
```

---

## Comparison Matrix

| Provider           | Speed        | Cost         | Privacy       | Offline | Quality    |
| ------------------ | ------------ | ------------ | ------------- | ------- | ---------- |
| **Gemini**         | ⚡ Very Fast | Free (quota) | ⚠️ Cloud      | ❌ No   | ⭐⭐⭐⭐⭐ |
| **OpenAI**         | ⚡ Fast      | $$ (paid)    | ⚠️ Cloud      | ❌ No   | ⭐⭐⭐⭐⭐ |
| **Local Llama 3B** | 🐌 Moderate  | Free         | ✅ 100% Local | ✅ Yes  | ⭐⭐⭐⭐   |

---

## Recommended Strategy

**For Story 3.2 Implementation:**

1. **Start with Gemini** (free, fast, excellent quality)
2. **Add Llama support** in parallel for offline capability
3. **Configure fallback**: If Gemini quota exceeded → switch to Llama automatically

**For Production:**

- **Online Mode:** Use Gemini (fast, free)
- **Offline Mode:** Use Local Llama (private, works without internet)
- **Privacy Mode:** User can manually select Llama in settings

---

## Next Steps

1. **Story 3.2 Implementation:** Implement provider abstraction
2. **Test with Gemini:** Validate extraction quality
3. **Test with Llama:** Validate offline capability
4. **Add Settings UI:** Let user choose provider preference

**Architecture Status:** 📋 Designed, ready for implementation in Story 3.2
