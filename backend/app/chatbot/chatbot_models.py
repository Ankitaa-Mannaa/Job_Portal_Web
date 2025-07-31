from app.db import get_db_connection

def save_chat_history(user_id, question, answer):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "INSERT INTO ai_chat_history (user_id, question, answer) VALUES (%s, %s, %s)",
                (user_id, question, answer)
            )
            conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

def get_chat_history(user_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT question, answer, timestamp FROM ai_chat_history WHERE user_id = %s ORDER BY timestamp DESC",
                (user_id,)
            )
            return cursor.fetchall()
    finally:
        conn.close()