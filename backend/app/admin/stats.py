import csv
import os
from app.db import get_db_connection

def get_user_stats():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT r.name, COUNT(*) AS count FROM users u JOIN roles r ON u.role_id = r.id GROUP BY r.name")
            return cursor.fetchall()
    finally:
        conn.close()

def get_job_stats():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) AS total_jobs FROM jobs")
            total_jobs = cursor.fetchone()['total_jobs']

            cursor.execute("SELECT COUNT(*) AS total_applications FROM applications")
            total_applications = cursor.fetchone()['total_applications']

            return {"total_jobs": total_jobs, "total_applications": total_applications}
    finally:
        conn.close()

def get_avg_resume_scores():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT j.id AS job_id, j.title,
                       AVG(s.score) AS avg_score
                FROM scores s
                JOIN jobs j ON s.job_id = j.id
                GROUP BY j.id, j.title
            """)
            return cursor.fetchall()
    finally:
        conn.close()

def get_dropoff_data():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT a.id, u.email, j.title, a.status, f.id AS feedback_id
                FROM applications a
                JOIN users u ON a.user_id = u.id
                JOIN jobs j ON a.job_id = j.id
                LEFT JOIN feedback f ON a.user_id = f.user_id AND a.job_id = f.job_id
                WHERE f.id IS NULL
            """)
            return cursor.fetchall()
    finally:
        conn.close()

def export_report_csv():
    data = get_avg_resume_scores()
    filename = "report.csv"
    filepath = os.path.join("exports", filename)
    os.makedirs("exports", exist_ok=True)

    with open(filepath, 'w', newline='') as csvfile:
        fieldnames = ['job_id', 'title', 'avg_score']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for row in data:
            writer.writerow(row)

    return filepath
