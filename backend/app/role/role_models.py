from app.db import get_db_connection

def create_role(name):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT id FROM roles WHERE name=%s", (name,))
            if not cursor.fetchone():
                cursor.execute("INSERT INTO roles (name) VALUES (%s)", (name,))
                conn.commit()
    finally:
        conn.close()

def get_role_by_name(name):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM roles WHERE name = %s", (name,))
            return cursor.fetchone()
    finally:
        conn.close()

