import requests
import os

def generate_questions(resume_text, job_description):
    try:
        prompt = f"""You are an expert interviewer.
                Given the resume and job description below, generate 3 short, role-specific interview questions.

                Resume:
                {resume_text}

                Job Description:
                {job_description}

                Only output the questions as a numbered list."""

        headers = {
            "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "mistralai/mistral-7b-instruct",  
            "messages": [
                {"role": "system", "content": "You are a helpful interview question generator."},
                {"role": "user", "content": prompt}
            ]
        }

        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)

        # DEBUG: print raw body for errors
        if response.status_code != 200:
            print(" OpenRouter response code:", response.status_code)
            print(" Response JSON:", response.text)
            response.raise_for_status()

        data = response.json()
        if "choices" in data and len(data["choices"]) > 0:
            text = data["choices"][0]["message"]["content"].strip()
            return text.split('\n')
        else:
            return ["Error: No choices returned from OpenRouter"]

    except Exception as e:
        print(" Error calling OpenRouter:", e)
        import traceback; traceback.print_exc()
        return [f"Error: {str(e)}"]
