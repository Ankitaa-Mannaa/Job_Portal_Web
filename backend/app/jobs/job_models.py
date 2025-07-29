from app.db import get_db_connection

def create_job(title, description, posted_by):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "INSERT INTO jobs (title, description, posted_by) VALUES (%s, %s, %s)",
                (title, description, posted_by)
            )
            conn.commit()
            return cursor.lastrowid 
    except Exception as e:
        conn.rollback()
        raise e  
    finally:
        conn.close()

from app.db import get_db_connection

def get_job_by_id(job_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM jobs WHERE id = %s", (job_id,))
            return cursor.fetchone()
    except Exception as e:
        raise e
    finally:
        conn.close()

def update_job_by_id(job_id, title, description):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "UPDATE jobs SET title=%s, description=%s WHERE id=%s",
                (title, description, job_id)
            )
            conn.commit()
            return cursor.rowcount  # returns number of rows updated
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

def delete_job_by_id(job_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM jobs WHERE id = %s", (job_id,))
            conn.commit()
            return cursor.rowcount  # returns number of rows deleted
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

def get_all_jobs_from_db():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT j.id, j.title, j.description, j.posted_by, j.created_at, u.email AS posted_by_email
                FROM jobs j
                JOIN users u ON j.posted_by = u.id
                ORDER BY j.id DESC
            """)
            return cursor.fetchall()
    except Exception as e:
        raise e
    finally:
        conn.close()

def get_jobs_by_company(company_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT j.id, j.title, j.description, j.posted_by, j.created_at
                FROM jobs j
                WHERE j.posted_by = %s
                ORDER BY j.id DESC
            """, (company_id,))
            return cursor.fetchall()
    finally:
        conn.close()

