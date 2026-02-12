#!/usr/bin/env python3
"""
List available Gemini models for this API key
Run: python backend/tests/list_gemini_models.py
"""
import os

def list_available_models():
    """List all available Gemini models"""
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        print("❌ GEMINI_API_KEY not found")
        return False
    
    print(f"🔑 Using API Key: {api_key[:20]}...")
    
    try:
        from google import genai
        
        client = genai.Client(api_key=api_key)
        
        print("\n📋 Listing available models...\n")
        
        models = client.models.list()
        
        for model in models:
            print(f"✓ {model.name}")
            if hasattr(model, 'supported_generation_methods'):
                print(f"  Methods: {model.supported_generation_methods}")
            print()
        
        return True
            
    except Exception as e:
        print(f"❌ Failed to list models: {e}")
        
        # Try simple test with gemini-exp
        print("\n🔬 Trying experimental model...")
        try:
            response = client.models.generate_content(
                model='gemini-exp-1206',
                contents="Hello"
            )
            print(f"✅ gemini-exp-1206 works!")
            return True
        except Exception as e2:
            print(f"❌ Also failed: {e2}")
            return False

if __name__ == "__main__":
    list_available_models()
