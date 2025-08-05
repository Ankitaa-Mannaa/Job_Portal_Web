'''def score_resume_against_job(resume_text, job_description):
    resume_text = resume_text.lower()
    job_description = job_description.lower()

    resume_words = set(resume_text.split())
    job_words = set(job_description.split())

    matched = resume_words.intersection(job_words)
    match_ratio = len(matched) / max(len(job_words), 1)

    return round(match_ratio * 100, 2)  # Percentage
'''

from app.jobs.job_parsed import extract_job_requirements

def rule_based_score(parsed_resume, job_description):
    score = 0
    weights = {"education": 0.3, "experience": 0.3, "skills": 0.4}
    total_weight = sum(weights.values())

    # Extract structured job requirements
    job_reqs = extract_job_requirements(job_description)

    required_education = job_reqs["required_education"]
    required_experience = job_reqs["required_experience"]
    required_skills = job_reqs["required_skills"]

    # Education check
    if any(ed in parsed_resume.get("education", []) for ed in required_education):
        score += 100 * weights["education"]

    # Experience check
    if parsed_resume.get("experience_years", 0) >= required_experience:
        score += 100 * weights["experience"]

    # Skill match
    resume_skills = set(parsed_resume.get("skills", []))
    match_ratio = len(resume_skills.intersection(required_skills)) / len(required_skills)
    score += match_ratio * 100 * weights["skills"]

    return round(score / total_weight, 2)
