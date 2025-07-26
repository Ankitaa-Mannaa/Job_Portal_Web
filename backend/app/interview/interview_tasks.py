from app.celery_worker import celery
from app.interview.interview_generator import generate_questions
from app.interview.interview_models import save_questions
from app.resume.resume_models import get_resume_text_by_user
from app.jobs.job_models import get_job_by_id

@celery.task(name='interview.generate_questions', bind=True)
def generate_interview_task(self, user_id, job_id):
    try:
        resume_text = get_resume_text_by_user(user_id)
        job = get_job_by_id(job_id)

        if not resume_text or not job:
            raise ValueError("Missing resume or job data")

        questions = generate_questions(resume_text, job['description'])
        save_questions(user_id, job_id, questions)

        return {"status": "generated", "questions": questions}
    except Exception as e:
        self.retry(exc=e, countdown=10, max_retries=2)
