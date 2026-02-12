#!/usr/bin/env python3
"""
Test Google Gemini API connection (using new google-genai package)
Run: python backend/tests/test_gemini_connection.py
"""
import os

def test_gemini_connection():
    """Test basic Gemini API connectivity"""
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        print("❌ GEMINI_API_KEY not found in environment")
        print("Make sure backend/.env contains GEMINI_API_KEY")
        return False
    
    print(f"🔑 API Key found: {api_key[:20]}...")
    
    try:
        from google import genai
        
        client = genai.Client(api_key=api_key)
        
        print("📡 Testing API connection with gemini-2.5-flash...")
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents="Say 'API connection successful!'"
        )
        
        result = response.text
        print(f"✅ Response: {result}")
        
        if "successful" in result.lower():
            print("✅ Gemini API connection verified!")
            print(f"   Model: gemini-2.5-flash (Free Tier)")
            return True
        else:
            print("⚠️  Unexpected response from API")
            return False
            
    except Exception as e:
        print(f"❌ API connection failed: {e}")
        return False

# Is test se hum check karte hain ki Gemini API sahi se kaam kar raha hai

if __name__ == "__main__":
    success = test_gemini_connection()
    exit(0 if success else 1)
