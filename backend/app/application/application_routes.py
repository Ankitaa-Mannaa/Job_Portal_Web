from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.access_control import role_required
from app.application.application_models import create_application, get_applications_by_user, update_application_status_by_id, delete_application_by_id
from app.jobs.job_models import get_job_by_id
from app.user.user_models import get_user_by_id  # Add at top if not already imported
from app.db import get_db_connection
import pymysql.cursors 

application_bp = Blueprint('application', __name__)
 
@application_bp.route('/', methods=['POST'])
@jwt_required()
@role_required('candidate')
def apply_job():
    data = request.get_json()
    user_id = int(get_jwt_identity())
    job_id = data.get('job_id')
 
    if not job_id:
        return jsonify({'msg': 'job_id is required'}), 400

    create_application(user_id, job_id, status="applied")
    return jsonify({'msg': 'Application submitted'})

@application_bp.route('/my', methods=['GET'])
@jwt_required()
@role_required('candidate')
def my_applications():
    user_id = int(get_jwt_identity())
    apps = get_applications_by_user(user_id) or []

    detailed_apps = []
    for app in apps:
        job = get_job_by_id(app['job_id'])
        if job:
            poster = get_user_by_id(job['posted_by']) if job and job.get('posted_by') else None

            detailed_apps.append({
                'application_id': app['id'],
                'status': app['status'],
                'job_id': app['job_id'],
                'job_title': job['title'],
                'company_name': poster['username'] if poster else 'Unknown'
            })

    return jsonify(detailed_apps)


@application_bp.route('/<int:app_id>', methods=['PUT'])
@jwt_required()
@role_required('company', 'admin')
def update_application_status(app_id):
    data = request.get_json()
    status = data.get('status') if data else None
    if not status:
        return jsonify({'msg': 'Status required'}), 400

    update_application_status_by_id(app_id, status)
    return jsonify({'msg': 'Application status updated'})


@application_bp.route('/<int:app_id>', methods=['DELETE'])
@jwt_required()
@role_required('company', 'candidate')
def delete_application(app_id):
    delete_application_by_id(app_id)
    return jsonify({'msg': 'Application deleted'}) 


@application_bp.route('/all', methods=['GET'])
@jwt_required()
@role_required('company')
def get_all_applicants_for_company():
    company_id = int(get_jwt_identity())
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            query = """
                SELECT 
                    a.id,
                    a.user_id,
                    a.job_id,
                    a.status,
                    a.applied_at,
                    u.username AS candidate_name,
                    u.email AS candidate_email,
                    j.title AS job_title
                FROM applications a
                JOIN users u ON a.user_id = u.id
                JOIN jobs j ON a.job_id = j.id
                WHERE j.posted_by = %s
                ORDER BY a.applied_at DESC
            """
            cursor.execute(query, (company_id,))
            return jsonify(cursor.fetchall())
    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({"msg": "Error retrieving applicants", "error": str(e)}), 500
    finally:
        conn.close()


@application_bp.route('/stats/interviews', methods=['GET'])
@jwt_required()
@role_required('company', 'admin')
def interview_stats_from_applications():
    company_id = int(get_jwt_identity())
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            query = """
                SELECT COUNT(*) AS total_interviews
                FROM applications a
                JOIN jobs j ON a.job_id = j.id
                WHERE j.posted_by = %s
                  AND LOWER(a.status) = 'interview'
            """
            cursor.execute(query, (company_id,))
            result = cursor.fetchone()
            return jsonify(result or {"total_interviews": 0})
    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({"msg": "Error retrieving interview stats", "error": str(e)}), 500
    finally:
        conn.close()
