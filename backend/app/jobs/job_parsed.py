import re

def extract_job_requirements(job_description):
    job_desc = job_description.lower()

    # Education extraction
    edu_keywords = ["bachelor", "b.tech", "bsc", "msc", "m.tech", "phd", "diploma"]
    required_education = [kw for kw in edu_keywords if kw in job_desc]
    if not required_education:
        required_education = ["bachelor"]  # fallback default

    # Experience extraction
    match = re.search(r"(\d+)\+?\s*(years|yrs)\s+(of)?\s*(experience)?", job_desc)
    required_experience = int(match.group(1)) if match else 2  # fallback

    # Skills extraction
    known_skills = {
        "python", "java", "c++", "flask", "django", "sql", "mongodb",
        "aws", "docker", "linux", "ml", "data science", "react", "html", "css"
    }
    required_skills = {skill for skill in known_skills if skill in job_desc}
    if not required_skills:
        required_skills = {"python", "sql"}  # fallback

    return {
        "required_education": required_education,
        "required_experience": required_experience,
        "required_skills": required_skills
    }
