"""
AI Extraction Service - Provider Abstraction Layer
Supports multiple AI providers for resume extraction: Gemini, Ollama
"""
from abc import ABC, abstractmethod
from typing import TypeVar, Type
from pydantic import BaseModel


T = TypeVar('T', bound=BaseModel)


class AIProvider(ABC):
    """Abstract base class for AI providers"""
    
    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Returns the name of the provider (e.g., 'gemini', 'ollama')"""
        pass
    
    @abstractmethod
    async def extract_with_schema(self, text: str, schema: Type[T]) -> T:
        """
        Extract structured data from text using the provided Pydantic schema.
        
        Args:
            text: Raw text to extract from (e.g., resume text)
            schema: Pydantic model class defining the expected structure
            
        Returns:
            Instance of the schema class with extracted data
            
        Raises:
            Exception: If extraction fails
        """
        pass
# Is abstract class se hum multiple AI providers (Gemini, Ollama) ko same interface de sakte hain
