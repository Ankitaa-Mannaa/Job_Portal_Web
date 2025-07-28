import os
import requests

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

def generate_questions(resume_text, job_description):
    prompt = f"""
You are an HR assistant. Based on the following resume and job description, generate 3 relevant screening interview questions.

Resume:
{resume_text}

Job Description:
{job_description}
    """

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "mistral/mistral-large-latest",
                "messages": [{"role": "user", "content": prompt}]
            }
        )
        content = response.json()['choices'][0]['message']['content']
        return content.strip().split('\n')[:3]
    except Exception as e:
        return [f"Error: {str(e)}"]
