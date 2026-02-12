# AI Provider Setup Guide for Story 3.2

## Environment Variables

Add these variables to your `.env` file:

```bash
# AI Provider Configuration
AI_PROVIDER=auto  # Options: gemini | ollama | auto
GEMINI_API_KEY=    # Get from https://ai.google.dev
OLLAMA_BASE_URL=http://localhost:11434
```

## Provider Options

### Option 1: Gemini (Cloud - Fast Setup)

1. Get API key from https://ai.google.dev
2. Add to `.env`:
   ```bash
   GEMINI_API_KEY=your_api_key_here
   AI_PROVIDER=gemini
   ```
3. Restart backend: `docker compose restart backend`

### Option 2: Ollama (Local - Privacy-First)

1. Install Ollama:

   ```bash
   brew install ollama
   ```

2. Pull Llama 3.2 3B model:

   ```bash
   ollama pull llama3.2:3b
   ```

3. Start Ollama server:

   ```bash
   ollama serve
   ```

4. Configure `.env`:

   ```bash
   OLLAMA_BASE_URL=http://localhost:11434
   AI_PROVIDER=ollama
   ```

5. Restart backend: `docker compose restart backend`

### Option 3: Auto (Recommended)

System automatically chooses:

- Ollama if available (privacy-first)
- Gemini as fallback (requires API key)

Configure `.env`:

```bash
AI_PROVIDER=auto
GEMINI_API_KEY=your_key_here  # Fallback
OLLAMA_BASE_URL=http://localhost:11434
```

## Testing

Test extraction endpoint:

```bash
curl -X POST http://localhost/api/v1/resumes/{resume_id}/extract \
  -H "Authorization: Bearer {your_token}"
```

## Troubleshooting

- **"AI_PROVIDER not configured"**: Add GEMINI_API_KEY or setup Ollama
- **"Ollama connection failed"**: Check `ollama serve` is running
- **"Gemini API error"**: Verify API key is valid

## Provider Comparison

<!--
- **Gemini**: Fast, cloud-based, requires API key, costs apply
- **Ollama**: Local, privacy-first, free, requires setup

Choose based on:
- Privacy needs: Use Ollama
- Quick setup: Use Gemini
- Best of both: Use Auto mode
