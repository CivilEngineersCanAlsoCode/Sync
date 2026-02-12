#!/usr/bin/env python3
"""
Test Local Llama via Ollama
Run: python backend/tests/test_llama_connection.py
"""
import os
import requests

def test_llama_connection():
    """Test local Llama connection via Ollama"""
    
    ollama_url = os.getenv("OLLAMA_URL", "http://localhost:11434")
    model = os.getenv("LLAMA_MODEL", "llama3.2:3b")
    
    print(f"🔧 Ollama URL: {ollama_url}")
    print(f"🤖 Model: {model}")
    
    try:
        # Check if Ollama is running
        print("\n📡 Checking Ollama service...")
        response = requests.get(f"{ollama_url}/api/tags", timeout=2)
        
        if response.status_code != 200:
            print("❌ Ollama service not responding")
            return False
        
        models = response.json().get("models", [])
        model_names = [m["name"] for m in models]
        print(f"✅ Ollama running. Available models: {model_names}")
        
        if model not in model_names:
            print(f"⚠️  Model {model} not found. Run: ollama pull {model}")
            return False
        
        # Test generation
        print(f"\n🧪 Testing {model} generation...")
        response = requests.post(
            f"{ollama_url}/api/generate",
            json={
                "model": model,
                "prompt": "Say 'API connection successful!' and nothing else.",
                "stream": False
            },
            timeout=30
        )
        
        if response.status_code != 200:
            print(f"❌ Generation failed: {response.status_code}")
            return False
        
        result = response.json()
        output = result.get("response", "")
        
        print(f"✅ Response: {output.strip()}")
        
        if "successful" in output.lower():
            print("✅ Local Llama connection verified!")
            print(f"   Model: {model} (Offline-capable)")
            return True
        else:
            print("⚠️  Unexpected response but model is working")
            return True
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to Ollama. Is it running? Try: ollama serve")
        return False
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False
# Is test se hum check karte hain ki local Llama model sahi se kaam kar raha hai

if __name__ == "__main__":
    success = test_llama_connection()
    exit(0 if success else 1)
