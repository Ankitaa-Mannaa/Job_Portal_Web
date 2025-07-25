from app.db import get_db_connection
import json

def save_questions(user_id, job_id, questions):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                REPLACE INTO interview_rounds (user_id, job_id, questions)
                VALUES (%s, %s, %s)
            """, (user_id, job_id, json.dumps(questions)))
            conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

def get_questions_for_candidate(user_id, job_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT questions FROM interview_rounds WHERE user_id=%s AND job_id=%s
            """, (user_id, job_id))
            row = cursor.fetchone()
            return json.loads(row['questions']) if row else None
    except Exception as e:
        raise e
    finally:
        conn.close()
