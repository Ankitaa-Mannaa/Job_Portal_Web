import os
import requests

API_KEY = os.getenv("OPENROUTER_API_KEY")

def generate_chat(prompt, context):
    if not API_KEY:
        return "LLM API key not configured"

    try:
        full_prompt = f"Context:\n{context}\n\nUser Question:\n{prompt}"
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "mistralai/mistral-7b-instruct",
                "messages": [{"role": "user", "content": full_prompt}]
            },
            timeout=20
        )
        response.raise_for_status()
        return response.json()['choices'][0]['message']['content']
    except Exception as e:
        return f"AI Error: {str(e)}"