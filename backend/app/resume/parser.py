import os
import fitz  # PyMuPDF
import re

def parse_resume(file_path):
    if not os.path.exists(file_path) or not file_path.endswith(".pdf"):
        raise ValueError("Invalid PDF path.")

    doc = fitz.open(file_path)
    text = "\n".join([page.get_text() for page in doc])
    doc.close()

    if not text.strip():
        raise ValueError("Resume is empty.")

    return text, extract_fields(text)


def extract_fields(text):
    text = text.lower()

    # Education (simple example)
    education_keywords = ["b.tech", "bachelor", "msc", "m.tech", "phd"]
    education = [kw for kw in education_keywords if kw in text]

    # Experience
    match = re.search(r"(\d+)\+?\s+(years|yrs)\s+(of)?\s*experience", text)
    years = int(match.group(1)) if match else 0

    # Skills
    skill_keywords = ["python", "sql", "flask", "ml", "django", "aws", "react"]
    skills = [skill for skill in skill_keywords if skill in text]

    return {
        "education": education,
        "experience_years": years,
        "skills": skills
    }