# OpenAI API Configuration

## Setup Instructions

### 1. Get API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create account
3. Navigate to "API Keys" section
4. Click "Create new secret key"
5. Copy the key (starts with `sk-...`)

---

### 2. Configure Environment Variables

**Backend `.env` file:**

```bash
# Add to backend/.env (or root .env if shared)
OPENAI_API_KEY=sk-your-actual-key-here
OPENAI_MODEL=gpt-4o-mini  # Cost-effective for structured extraction
OPENAI_ORG_ID=  # Optional: Add if you have an organization ID
```

**Security Note:**

- ✅ `.env` is already in `.gitignore` (Tiangolo template default)
- ❌ Never commit API keys to version control
- ✅ Use environment variables for all secrets

---

### 3. Install OpenAI SDK

```bash
cd backend
pip install openai
# or add to requirements.txt:
# openai>=1.3.0
```

---

### 4. Test API Connection

Create `backend/tests/test_openai.py`:

```python
import os
from openai import OpenAI

def test_openai_connection():
    """Test basic OpenAI API connectivity"""
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": "Say 'API connection successful!'"}
        ],
        max_tokens=20
    )

    assert "successful" in response.choices[0].message.content.lower()
    print("✅ OpenAI API connection verified")
# Is test se hum check karte hain ki OpenAI API sahi se kaam kar raha hai

if __name__ == "__main__":
    test_openai_connection()
```

Run test:

```bash
python backend/tests/test_openai.py
```

---

### 5. Usage Example (Story 3.2)

**Extracting structured data from resume:**

```python
from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def extract_resume_structure(resume_text: str) -> dict:
    """
    Use AI to extract projects, experience, and skills from resume text.
    """
    prompt = f\"\"\"
    Extract the following from this resume text:
    1. Projects (list with names and descriptions)
    2. Work Experience (company, role, duration)
    3. Skills (technical skills list)

    Resume Text:
    {resume_text}

    Return ONLY valid JSON in this format:
    {{
        "projects": [
            {{"name": "...", "description": "..."}}
        ],
        "experience": [
            {{"company": "...", "role": "...", "duration": "..."}}
        ],
        "skills": ["skill1", "skill2"]
    }}
    \"\"\"

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},  # Ensures valid JSON
        temperature=0.3  # Lower for more consistent extraction
    )

    import json
    return json.loads(response.choices[0].message.content)
# Is function se AI resume ko structured data mein convert karta hai
```

---

### 6. Cost Estimation

**Model:** `gpt-4o-mini`  
**Input:** ~1000 tokens (typical resume)  
**Output:** ~500 tokens (structured JSON)  
**Cost:** ~$0.0003 per resume (negligible)

For 1000 resume uploads: ~$0.30 total cost

---

### 7. Error Handling

```python
from openai import OpenAI, OpenAIError

try:
    response = client.chat.completions.create(...)
except OpenAIError as e:
    print(f"OpenAI API error: {e}")
    return {
        "error": "AI se resume parse nahi ho pa raha",
        "code": "AI_PARSE_ERROR"
    }
```

---

## Next Steps

- [ ] Satvik: Obtain OpenAI API key
- [ ] Add `OPENAI_API_KEY` to backend `.env`
- [ ] Run test script to verify connection
- [ ] Ready for Story 3.2 implementation

**Status:** 🟡 Configuration documented, API key pending  
**Owner:** Elena (Junior Dev) + Charlie (pair programming)  
**Estimated Setup Time:** 10 minutes
