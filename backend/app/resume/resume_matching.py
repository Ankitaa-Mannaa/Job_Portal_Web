from app.resume.resume_models import get_resume_text_by_user
from app.resume.embedder import embed_text
from app.resume.vectorstore import query_similar_resumes
from app.jobs.job_models import get_job_by_id
from app.resume.resume_score import score_resume_against_job

def recommend_jobs_for_candidate(user_id):
    resume_text = get_resume_text_by_user(user_id)
    if not resume_text:
        return []

    resume_embedding = embed_text(resume_text)
    matches = query_similar_resumes(resume_embedding, top_k=5)

    job_ids = [int(match_id) for match_id in matches['ids'][0]]
    results = []

    for job_id in job_ids:
        job = get_job_by_id(job_id)
        if job:
            score = score_resume_against_job(resume_text, job['description'])
            results.append({'job': job, 'score': score})

    results.sort(key=lambda x: x['score'], reverse=True)
    return results