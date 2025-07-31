from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.access_control import role_required
from app.feedback.feedback_models import (
    add_feedback,
    get_feedback_by_user,
    get_feedback_for_user_by_job 
)
from app.jobs.job_models import get_job_by_id
from app.application.application_models import get_applications_by_user

feedback_bp = Blueprint('feedback', __name__)

# Give feedback (HR/Admin) — secured to jobs they posted and valid applicants only
@feedback_bp.route('/', methods=['POST'])
@jwt_required()
@role_required('company', 'admin')
def give_feedback():
    print("🔐 Logged-in HR ID:", get_jwt_identity())
    data = request.get_json()
    candidate_id = int(data.get('user_id'))
    job_id = int(data.get('job_id'))
    feedback = data.get('feedback')
    hr_id = int(get_jwt_identity())

    if not all([candidate_id, job_id, feedback]):
        return jsonify({'msg': 'All fields are required'}), 400

    # Validate job ownership
    job = get_job_by_id(job_id)
    #print(" Job record:", job)
    #print(" Job posted_by:", job.get('posted_by'), type(job.get('posted_by')))
    #print(" HR ID:", hr_id, type(hr_id))
    if not job:
        return jsonify({'msg': 'Job not found'}), 404
    if job['posted_by'] != hr_id:
        return jsonify({'msg': 'You do not own this job'}), 403

    # Validate candidate actually applied
    apps = get_applications_by_user(candidate_id)
    #print(" Checking if candidate", candidate_id, "has applied to job", job_id)
    #print(" Candidate's Applications:", apps)
    #print(" Candidate applied job_ids:", [a['job_id'] for a in apps])
    if job_id not in [a['job_id'] for a in apps]:
        return jsonify({'msg': 'Candidate has not applied to this job'}), 403

    try:
        add_feedback(candidate_id, job_id, feedback, hr_id)
        return jsonify({'msg': 'Feedback submitted'}), 201
    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({'msg': 'Failed to submit feedback', 'error': str(e)}), 500

# HR/Admin can view feedback given to a specific candidate (any job)
@feedback_bp.route('/candidate/<int:user_id>', methods=['GET'])
@jwt_required()
@role_required('company', 'admin')
def get_feedback_for_candidate(user_id):
    try:
        data = get_feedback_by_user(user_id)
        return jsonify(data)
    except Exception as e:
        return jsonify({'msg': 'Failed to fetch feedback', 'error': str(e)}), 500

# Candidate can view feedbacks received from companies (only their own)
@feedback_bp.route('/my', methods=['GET'])
@jwt_required()
@role_required('candidate')
def get_my_feedback():
    user_id = int(get_jwt_identity())
    print("✅ Extracted user_id:", user_id)
    try:
        data = get_feedback_by_user(user_id)
        print("✅ Fetched feedback count:", len(data))
        return jsonify(data)
    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({'msg': 'Failed to fetch your feedback', 'error': str(e)}), 500

# Candidate views feedback from a specific company about them
@feedback_bp.route('/for-job/<int:job_id>', methods=['GET'])
@jwt_required()
@role_required('candidate')
def get_feedback_for_job(job_id):
    user_id = int(get_jwt_identity())
    print("✅ Extracted user_id:", user_id)
    try:
        data = get_feedback_for_user_by_job(user_id, job_id)
        print("✅ Fetched feedback count:", len(data))
        return jsonify(data)
    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({'msg': 'Failed to fetch feedback for job', 'error': str(e)}), 500
