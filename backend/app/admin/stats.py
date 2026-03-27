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


def get_dropoff_data():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # 1. Grouped drop-off counts by application status
            cursor.execute("""
                SELECT a.status, COUNT(*) as count
                FROM applications a
                LEFT JOIN feedback f 
                  ON a.user_id = f.user_id AND a.job_id = f.job_id
                WHERE f.id IS NULL
                GROUP BY a.status
            """)
            dropoff_summary = cursor.fetchall()

            # 2. Detailed list of applications without feedback
            cursor.execute("""
                SELECT a.id AS application_id, u.username, u.email, j.title AS job_title, a.status
                FROM applications a
                JOIN users u ON a.user_id = u.id
                JOIN jobs j ON a.job_id = j.id
                LEFT JOIN feedback f 
                  ON a.user_id = f.user_id AND a.job_id = f.job_id
                WHERE f.id IS NULL
            """)
            no_feedback_list = cursor.fetchall()

            return {
                "summary": dropoff_summary,
                "no_feedback": no_feedback_list
            }
    finally:
        conn.close()

def get_avg_resume_scores():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    rs.job_id,
                    j.title AS job_title,
                    ROUND(AVG(rs.score), 2) AS avg_score,
                    COUNT(rs.user_id) AS num_candidates
                FROM resume_scores rs
                JOIN jobs j ON rs.job_id = j.id
                GROUP BY rs.job_id, j.title
                ORDER BY avg_score DESC
            """)
            return cursor.fetchall()
    finally:
        conn.close()
        

EXPORT_DIR = os.path.join(os.path.dirname(__file__), "exports")
os.makedirs(EXPORT_DIR, exist_ok=True)

def export_report_csv():
    file_path = os.path.join(EXPORT_DIR, "report.csv")

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor, open(file_path, mode='w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)

            # 1. User Stats
            cursor.execute("SELECT COUNT(*) as total FROM users")
            total = cursor.fetchone()['total']
            cursor.execute("SELECT COUNT(*) as admins FROM users u JOIN roles r ON u.role_id = r.id WHERE r.name = 'admin'")
            admins = cursor.fetchone()['admins']
            cursor.execute("SELECT COUNT(*) as companies FROM users u JOIN roles r ON u.role_id = r.id WHERE r.name = 'company'")
            companies = cursor.fetchone()['companies']
            cursor.execute("SELECT COUNT(*) as candidates FROM users u JOIN roles r ON u.role_id = r.id WHERE r.name = 'candidate'")
            candidates = cursor.fetchone()['candidates']

            writer.writerow(["User Stats"])
            writer.writerow(["Total Users", "Admins", "Companies", "Candidates"])
            writer.writerow([total, admins, companies, candidates])
            writer.writerow([])

            # 2. Job Stats
            cursor.execute("SELECT COUNT(*) as total_jobs FROM jobs")
            total_jobs = cursor.fetchone()['total_jobs']

            cursor.execute("SELECT AVG(app_count) as avg_apps FROM (SELECT COUNT(*) as app_count FROM applications GROUP BY job_id) as temp")
            avg_apps = cursor.fetchone()['avg_apps'] or 0

            cursor.execute("""
                SELECT j.title, COUNT(*) as count 
                FROM applications a 
                JOIN jobs j ON a.job_id = j.id 
                GROUP BY a.job_id 
                ORDER BY count DESC 
                LIMIT 1
            """)
            most_applied = cursor.fetchone() or {"title": "N/A", "count": 0}

            writer.writerow(["Job Stats"])
            writer.writerow(["Total Jobs", "Avg. Applications/Job", "Most Applied Job", "Total Apps for That Job"])
            writer.writerow([total_jobs, round(avg_apps, 2), most_applied['title'], most_applied['count']])
            writer.writerow([])

            # 3. Resume Score Averages
            cursor.execute("""
                SELECT j.title, rs.job_id, ROUND(AVG(rs.score), 2) as avg_score, COUNT(rs.user_id) as total
                FROM resume_scores rs
                JOIN jobs j ON rs.job_id = j.id
                GROUP BY rs.job_id, j.title
            """)
            scores = cursor.fetchall()

            writer.writerow(["Average Resume Score Per Job"])
            writer.writerow(["Job Title", "Job ID", "Avg Score", "Candidates Scored"])
            for row in scores:
                writer.writerow([row['title'], row['job_id'], row['avg_score'], row['total']])
            writer.writerow([])

            # 4. Drop-off Analytics
            cursor.execute("SELECT COUNT(DISTINCT user_id) as uploaded FROM resumes")
            uploaded = cursor.fetchone()['uploaded']
            cursor.execute("SELECT COUNT(*) as total_applied FROM applications")
            applied = cursor.fetchone()['total_applied']

            cursor.execute("""
                SELECT COUNT(DISTINCT user_id) as applied_without_resume
                FROM applications
                WHERE user_id NOT IN (SELECT DISTINCT user_id FROM resumes)
            """)
            applied_no_resume = cursor.fetchone()['applied_without_resume']

            writer.writerow(["Drop-off Analytics"])
            writer.writerow(["Resume Uploaded", "Total Applications", "Applied Without Resume"])
            writer.writerow([uploaded, applied, applied_no_resume])
            writer.writerow([])

            # 5. Raw Resume Scores
            cursor.execute("""
                SELECT rs.user_id, u.username, rs.job_id, j.title AS job_title, rs.score
                FROM resume_scores rs
                JOIN users u ON rs.user_id = u.id
                JOIN jobs j ON rs.job_id = j.id
            """)
            raw_scores = cursor.fetchall()

            writer.writerow(["Raw Resume Scores"])
            writer.writerow(["User ID", "Username", "Job ID", "Job Title", "Score"])
            for row in raw_scores:
                writer.writerow([row['user_id'], row['username'], row['job_id'], row['job_title'], row['score']])

        return file_path
    finally:
        conn.close()
