"""
AI Extraction Factory and Dependency Injection
Creates AI providers based on configuration
"""
import os
from typing import Annotated
from fastapi import Depends
from sqlmodel import Session

from app.core.config import settings
from app.services.ai_extractor import AIProvider
from app.services.gemini_provider import GeminiProvider
from app.services.ollama_provider import OllamaProvider


def get_ai_provider() -> AIProvider:
    """
    Factory function to create AI provider based on configuration.
    Tries Ollama first (local/privacy-first), falls back to Gemini.
    
    Returns:
        AIProvider instance (Gemini or Ollama)
    """
    provider_mode = os.getenv("AI_PROVIDER", "auto").lower()
    
    if provider_mode == "ollama":
        # Force Ollama
        ollama_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        print(f"AI Provider: Ollama ko force kar rahe hain (URL: {ollama_url})")
        return OllamaProvider(base_url=ollama_url)
    
    elif provider_mode == "gemini":
        # Force Gemini
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable missing hai")
        print("AI Provider: Gemini ko force kar rahe hain")
        return GeminiProvider(api_key=api_key)
    
    else:
        # Auto mode: Try Ollama first, fallback to Gemini
        ollama_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        try:
            # Quick health check for Ollama
            import httpx
            with httpx.Client(timeout=2.0) as client:
                response = client.get(f"{ollama_url}/api/version")
                if response.status_code == 200:
                    print(f"AI Provider: Ollama detect hua, use kar rahe hain (privacy-first)")
                    return OllamaProvider(base_url=ollama_url)
        except Exception:
            pass
        
        # Fallback to Gemini
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("Ollama available nahi hai aur GEMINI_API_KEY bhi missing hai. At least one AI provider chahiye.")
        
        print("AI Provider: Gemini use kar rahe hain (Ollama available nahi tha)")
        return GeminiProvider(api_key=api_key)
# Is factory function se hum automatically sahi AI provider choose karte hain (local ya cloud)


# Dependency for FastAPI
AIExtractorDep = Annotated[AIProvider, Depends(get_ai_provider)]
