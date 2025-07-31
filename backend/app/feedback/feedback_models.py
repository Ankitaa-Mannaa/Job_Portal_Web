from app.db import get_db_connection

def add_feedback(user_id, job_id, feedback_text, posted_by):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO feedback (user_id, job_id, feedback, hr_id)
                VALUES (%s, %s, %s, %s)
            """, (user_id, job_id, feedback_text, posted_by))
            conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()


def get_feedback_for_user_by_job(user_id, job_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT f.feedback, f.created_at, u.username AS company_name
                FROM feedback f
                JOIN users u ON f.hr_id = u.id
                WHERE f.user_id = %s AND f.job_id = %s
            """, (user_id, job_id))
            return cursor.fetchall()
    finally:
        conn.close()


def get_feedback_by_user(user_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT f.job_id, j.title AS job_title, f.feedback, f.created_at, u.username AS posted_by
                FROM feedback f
                JOIN jobs j ON f.job_id = j.id
                LEFT JOIN users u ON f.hr_id = u.id
                WHERE f.user_id = %s
                ORDER BY f.created_at DESC
            """, (user_id,))
            return cursor.fetchall()
    finally:
        conn.close()
