# Google Gemini API Configuration

## Setup Instructions

### 1. Get API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with Google account
3. Click "Get API Key" or "Create API Key"
4. Copy the key (starts with `AIza...`)

---

### 2. Configure Environment Variables

**Backend `.env` file:**

```bash
# Add to backend/.env
GEMINI_API_KEY=AIzaSyBagna_Flw5iLrjMqN4oGydMLcGNkxkcEY
GEMINI_MODEL=gemini-1.5-flash  # Fast and cost-effective model
```

**Security Note:**

- ✅ `.env` is already in `.gitignore`
- ❌ Never commit API keys to version control
- ✅ Use environment variables for all secrets

---

### 3. Install Gemini SDK

```bash
cd backend
.venv/bin/pip install google-generativeai
```

---

### 4. Test API Connection

Create and run test:

```bash
cd backend
.venv/bin/python tests/test_gemini_connection.py
```

---

### 5. Usage Example (Story 3.2)

**Extracting structured data from resume:**

````python
import google.generativeai as genai
import os
import json

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def extract_resume_structure(resume_text: str) -> dict:
    """
    Use Gemini AI to extract projects, experience, and skills from resume text.
    """
    model = genai.GenerativeModel('gemini-1.5-flash')

    prompt = f"""
    Extract the following from this resume text and return ONLY valid JSON:

    1. Projects (list with names and descriptions)
    2. Work Experience (company, role, duration)
    3. Skills (technical skills list)

    Resume Text:
    {resume_text}

    Return in this exact JSON format:
    {{
        "projects": [
            {{"name": "Project Name", "description": "What it does"}}
        ],
        "experience": [
            {{"company": "Company Name", "role": "Job Title", "duration": "2020-2023"}}
        ],
        "skills": ["Python", "React", "FastAPI"]
    }}
    """

    response = model.generate_content(prompt)

    # Extract JSON from response
    result_text = response.text

    # Remove markdown code blocks if present
    if "```json" in result_text:
        result_text = result_text.split("```json")[1].split("```")[0].strip()
    elif "```" in result_text:
        result_text = result_text.split("```")[1].split("```")[0].strip()

    return json.loads(result_text)
# Is function se Gemini AI resume ko structured data mein convert karta hai
````

---

### 6. Cost Estimation

**Model:** `gemini-1.5-flash`  
**Free Tier:** 15 requests per minute, 1500 requests per day  
**Input:** ~1000 tokens (typical resume)  
**Output:** ~500 tokens (structured JSON)  
**Cost:** **FREE** for typical usage (within quotas)

**Gemini 1.5 Flash Pricing (if exceeding free tier):**

- Input: $0.075 per 1M tokens
- Output: $0.30 per 1M tokens
- **Cost per resume:** ~$0.00045 (even cheaper than OpenAI!)

For 1000 resume uploads: ~$0.45 total cost

---

### 7. Error Handling

```python
import google.generativeai as genai

try:
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(prompt)
    result = response.text
except Exception as e:
    print(f"Gemini API error: {e}")
    return {
        "error": "AI se resume parse nahi ho pa raha",
        "code": "AI_PARSE_ERROR"
    }
```

---

### 8. Model Options

| Model                  | Speed        | Quality   | Use Case                        |
| ---------------------- | ------------ | --------- | ------------------------------- |
| `gemini-1.5-flash`     | ⚡ Fast      | Good      | Resume extraction (recommended) |
| `gemini-1.5-pro`       | 🐌 Slower    | Excellent | Complex documents               |
| `gemini-2.0-flash-exp` | ⚡ Very Fast | Good      | Experimental, latest features   |

**Recommendation:** Use `gemini-1.5-flash` for Story 3.2 - perfect balance for resume parsing.

---

## Advantages Over OpenAI

✅ **Free Tier:** Generous free quotas (15 RPM, 1500 RPD)  
✅ **Cost:** 5-10x cheaper than GPT-4o-mini when paying  
✅ **Quality:** Comparable structured extraction quality  
✅ **Speed:** Flash models are very fast  
✅ **Context:** 1M token context window (can handle very long resumes)

---

## Next Steps

- [x] Obtain Gemini API key
- [x] Add `GEMINI_API_KEY` to backend `.env`
- [x] Install `google-generativeai` SDK
- [x] Run test script to verify connection
- [x] Ready for Story 3.2 implementation

**Status:** ✅ Complete and tested  
**Owner:** Charlie + Elena  
**Setup Time:** 5 minutes
