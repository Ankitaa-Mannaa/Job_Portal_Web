from app.celery_worker import celery
from app.resume.parser import parse_resume
from app.resume.embedder import embed_text
from app.resume.resume_models import store_parsed_resume, get_resume_text_by_user
from app.resume.vectorstore import add_resume_embedding
from app.jobs.job_models import get_job_by_id
from app.resume.resume_score import score_resume_against_job


@celery.task(name='resume.process_resume_task', bind=True)
def process_resume_task(self, user_id, file_path):
    try:
        text = parse_resume(file_path)
        embedding = embed_text(text)
        store_parsed_resume(user_id, file_path, text)
        add_resume_embedding(user_id, embedding, {"text": text})
        return {"status": "success"}
    except Exception as e:
        self.retry(exc=e, countdown=5, max_retries=3)


@celery.task(name='resume.score_resume_task', bind=True)
def score_resume_task(self, user_id, job_id):
    try:
        resume_text = get_resume_text_by_user(user_id)
        job = get_job_by_id(job_id)

        if not resume_text or not job:
            raise ValueError("Missing resume or job data")

        score = score_resume_against_job(resume_text, job["description"])
        # You can save score using: store_resume_score(user_id, job_id, score) if implemented
        return {"status": "scored", "score": score}
    except Exception as e:
        self.retry(exc=e, countdown=10, max_retries=3)


from app.resume.resume_models import store_resume_score

@celery.task(name='resume.score_resume_task', bind=True)
def score_resume_task(self, user_id, job_id):
    try:
        resume_text = get_resume_text_by_user(user_id)
        job = get_job_by_id(job_id)

        if not resume_text or not job:
            raise ValueError("Missing resume or job data")

        score = score_resume_against_job(resume_text, job["description"])
        store_resume_score(user_id, job_id, score)
        return {"status": "scored", "score": score}
    except Exception as e:
        self.retry(exc=e, countdown=10, max_retries=3)
