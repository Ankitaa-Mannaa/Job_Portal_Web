from app.db import get_db_connection

def store_parsed_resume(user_id, file_path, resume_text):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "REPLACE INTO resumes (user_id, file_path, resume_text) VALUES (%s, %s, %s)",
                (user_id, file_path, resume_text)
            )
            conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

def get_resume_text_by_user(user_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT resume_text FROM resumes WHERE user_id = %s", (user_id,))
            result = cursor.fetchone()
            return result['resume_text'] if result else None
    finally:
        conn.close()
