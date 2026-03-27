from app.resume.resume_models import get_resume_text_by_user
from app.resume.embedder import embed_text
from app.jobs.job_vectorstore import query_similar_jobs
from app.jobs.job_models import get_job_by_id
import traceback
from app.resume.resume_models import get_parsed_resume_by_user
from app.resume.resume_score import rule_based_score


def recommend_jobs_for_candidate(user_id):
    try:
        print(f" Starting job recommendation for user_id={user_id}")

        resume_text = get_resume_text_by_user(user_id)
        if not resume_text:
            print(f" No resume found for user {user_id}")
            return []

        print(" Resume text length:", len(resume_text))

        resume_embedding = embed_text(resume_text)
        print(" Resume embedding vector length:", len(resume_embedding))

        matches = query_similar_jobs(resume_embedding, top_k=5)
        print(" Matched job IDs from vector DB:", matches.get('ids', [[]])[0])

        job_ids = [int(match_id) for match_id in matches['ids'][0]]
        results = []

        for job_id in job_ids:
            try:
                job = get_job_by_id(job_id)
                if job:
                    parsed_resume = get_parsed_resume_by_user(user_id)
                    score = rule_based_score(parsed_resume, job['description'])
                    results.append({'job': job, 'score': round(score, 2)})
                    print(f" Job {job_id} matched with score: {score:.2f}")
                else:
                    print(f" Job ID {job_id} not found in DB.")
            except Exception as job_err:
                print(f" Error processing job ID {job_id}:", job_err)
                traceback.print_exc()

        results.sort(key=lambda x: x['score'], reverse=True)
        print(f" Final sorted top jobs: {results}")
        return results

    except Exception as e:
        print(" Error in recommend_jobs_for_candidate():", e)
        traceback.print_exc()
        return []
