from app.db import get_db_connection

def create_application(user_id, job_id, status="applied"):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "INSERT INTO applications (user_id, job_id, status) VALUES (%s, %s, %s)",
                (user_id, job_id, status)
            )
            conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

def get_applications_by_user(user_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM applications WHERE user_id = %s", (user_id,))
            return cursor.fetchall()
    finally:
        conn.close()


def update_application_status_by_id(app_id, status):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "UPDATE applications SET status=%s WHERE id=%s",
                (status, app_id)
            )
            conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

def delete_application_by_id(app_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM applications WHERE id=%s", (app_id,))
            conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()