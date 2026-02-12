"""
Ollama AI Provider - Local LLM integration
Uses Llama 3.2 3B for privacy-first structured extraction
"""
import json
from typing import Type, TypeVar
from pydantic import BaseModel
import httpx

from app.services.ai_extractor import AIProvider


T = TypeVar('T', bound=BaseModel)


class OllamaProvider(AIProvider):
    """Ollama local AI provider for privacy-first resume extraction"""
    
    def __init__(self, base_url: str = "http://localhost:11434"):
        """
        Initialize Ollama provider
        
        Args:
            base_url: Ollama server URL (default: local host)
        """
        self.base_url = base_url
        self.model = "llama3.2:3b"
    # Ollama provider ko local server ke liye configure karte hain (privacy-first)
    
    @property
    def provider_name(self) -> str:
        return "ollama"
    
    async def extract_with_schema(self, text: str, schema: Type[T]) -> T:
        """
        Extract career profile using local Ollama LLM with structured output
        
        Args:
            text: Resume raw text
            schema: Pydantic model for structure enforcement
            
        Returns:
            Parsed Pydantic model instance
        """
        # Convert Pydantic schema to JSON schema
        json_schema = schema.model_json_schema()
        
        # Create extraction prompt
        prompt = f"""Extract career profile information from this resume text.

Resume:
{text}

Analyze and extract:
1. Projects: Significant projects with technologies and impact
2. Experience: Work history with companies, roles, durations, responsibilities
3. Skills: Technical and professional skills in categories

Return valid JSON matching this schema:
{json.dumps(json_schema, indent=2)}

If a section is not found, return an empty list for that section."""
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "format": json_schema,  # Ollama's structured output mode
                        "stream": False
                    },
                    timeout=120.0  # 2 minutes for local processing
                )
                response.raise_for_status()
                result = response.json()
                
                # Parse and validate response
                return schema.model_validate_json(result["response"])
                
        except httpx.HTTPError as e:
            print(f"Ollama connection mein error: {str(e)}")
            raise Exception(f"Ollama se connect nahi ho paya: {str(e)}")
        except json.JSONDecodeError as e:
            print(f"Ollama response parse nahi ho paya: {str(e)}")
            raise Exception(f"AI response invalid tha: {str(e)}")
        except Exception as e:
            print(f"Ollama extraction mein error aaya: {str(e)}")
            raise Exception(f"AI extraction failed ho gayi: {str(e)}")
# Is provider se hum local Llama 3.2 3B model ka use karte hain (privacy-first, no cloud)
