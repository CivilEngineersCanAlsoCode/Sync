"""
Gemini AI Provider - Google Generative AI integration
Uses Gemini Flash for structured JSON extraction from resumes
"""
import json
from typing import Type, TypeVar
from pydantic import BaseModel

from app.services.ai_extractor import AIProvider


T = TypeVar('T', bound=BaseModel)


class GeminiProvider(AIProvider):
    """Google Gemini AI provider for structured resume extraction"""
    
    def __init__(self, api_key: str):
        """
        Initialize Gemini provider
        
        Args:
            api_key: Google Gemini API key from ai.google.dev
        """
        try:
            import google.generativeai as genai
        except ImportError:
            raise ImportError(
                "google-generativeai package missing hai. Install karo: pip install google-generativeai"
            )
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(
            model_name="gemini-1.5-flash-latest",
            generation_config={
                "response_mime_type": "application/json",
            }
        )
    # Gemini provider ko API key se configure karte hain aur JSON mode set karte hain
    
    @property
    def provider_name(self) -> str:
        return "gemini"
    
    async def extract_with_schema(self, text: str, schema: Type[T]) -> T:
        """
        Extract career profile using Gemini with structured JSON output
        
        Args:
            text: Resume raw text
            schema: Pydantic model for structure enforcement
            
        Returns:
            Parsed Pydantic model instance
        """
        # Convert Pydantic schema to JSON schema for Gemini
        json_schema = schema.model_json_schema()
        
        # Create extraction prompt
        prompt = f"""Extract career profile information from the following resume text.

Resume Text:
{text}

Analyze the text and extract:
1. Projects: Any significant projects mentioned with technologies used
2. Experience: Work history with companies, roles, duration, and responsibilities
3. Skills: Technical and professional skills, categorized appropriately

Return a JSON object matching the provided schema with all available information.
If a section is not found, return an empty list for that section."""
        
        try:
            # Generate with structured output
            response = self.model.generate_content(
                prompt,
                generation_config={"response_schema": json_schema}
            )
            
            # Parse and validate response
            return schema.model_validate_json(response.text)
            
        except Exception as e:
            print(f"Gemini extraction mein error aaya: {str(e)}")
            raise Exception(f"AI extraction failed ho gayi: {str(e)}")
# Is provider se hum Google Gemini AI ka use karke structured JSON output lete hain
