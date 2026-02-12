#!/usr/bin/env python3
"""
Test OpenAI API connection
Run: python backend/tests/test_openai_connection.py
"""
import os
from openai import OpenAI

def test_openai_connection():
    """Test basic OpenAI API connectivity"""
    api_key = os.getenv("OPENAI_API_KEY")
    
    if not api_key:
        print("❌ OPENAI_API_KEY not found in environment")
        print("Make sure backend/.env contains OPENAI_API_KEY")
        return False
    
    print(f"🔑 API Key found: {api_key[:20]}...")
    
    try:
        client = OpenAI(api_key=api_key)
        
        print("📡 Testing API connection...")
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": "Say 'API connection successful!'"}
            ],
            max_tokens=20
        )
        
        result = response.choices[0].message.content
        print(f"✅ Response: {result}")
        
        if "successful" in result.lower():
            print("✅ OpenAI API connection verified!")
            return True
        else:
            print("⚠️  Unexpected response from API")
            return False
            
    except Exception as e:
        print(f"❌ API connection failed: {e}")
        return False
# Is test se hum check karte hain ki OpenAI API sahi se kaam kar raha hai

if __name__ == "__main__":
    success = test_openai_connection()
    exit(0 if success else 1)
