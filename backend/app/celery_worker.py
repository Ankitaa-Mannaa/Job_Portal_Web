from celery import Celery
import os
from dotenv import load_dotenv

load_dotenv()

celery = Celery(
    'recruitment_platform',
    broker=os.getenv("CELERY_BROKER_URL"),
    backend=os.getenv("CELERY_RESULT_BACKEND")
)

celery.conf.imports = [
    'app.resume.resume_tasks',             # Add more task modules below as needed
    'app.interview.interview_tasks'
]
