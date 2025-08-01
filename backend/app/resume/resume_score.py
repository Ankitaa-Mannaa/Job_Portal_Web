def rule_based_score(parsed_resume, job_description):
    score = 0
    weights = {"education": 0.3, "experience": 0.3, "skills": 0.4}
    total_weight = sum(weights.values())

    # Simulated expectations (replace with structured job data if available)
    required_education = ["bachelor", "b.tech"]
    required_experience = 2
    required_skills = {"python", "flask", "sql"}

    # Education match
    if any(ed in parsed_resume.get("education", []) for ed in required_education):
        score += 100 * weights["education"]

    # Experience match
    if parsed_resume.get("experience_years", 0) >= required_experience:
        score += 100 * weights["experience"]

    # Skills match
    skills = set(parsed_resume.get("skills", []))
    match_ratio = len(skills.intersection(required_skills)) / len(required_skills)
    score += match_ratio * 100 * weights["skills"]

    return round(score / total_weight, 2)
