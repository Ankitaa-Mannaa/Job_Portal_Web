def score_resume_against_job(resume_text, job_description):
    resume_text = resume_text.lower()
    job_description = job_description.lower()

    resume_words = set(resume_text.split())
    job_words = set(job_description.split())

    matched = resume_words.intersection(job_words)
    match_ratio = len(matched) / max(len(job_words), 1)

    return round(match_ratio * 100, 2)  # Percentage
