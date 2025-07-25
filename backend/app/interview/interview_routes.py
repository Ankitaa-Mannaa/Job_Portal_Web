from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.access_control import role_required
from app.interview.interview_models import save_questions, get_questions_for_candidate
from app.resume.resume_models import get_resume_text_by_user
from app.jobs.job_models import get_job_by_id
from app.interview.interview_generator import generate_questions

interview_bp = Blueprint('interview', __name__)

@interview_bp.route('/assign', methods=['POST'])
@jwt_required()
@role_required('company', 'admin')
def assign_interview():
    data = request.get_json()
    user_id = data.get('user_id')
    job_id = data.get('job_id')

    resume_text = get_resume_text_by_user(user_id)
    job = get_job_by_id(job_id)

    if not resume_text or not job:
        return jsonify({'msg': 'Missing resume or job info'}), 404

    questions = generate_questions(resume_text, job['description'])
    save_questions(user_id, job_id, questions)
    return jsonify({'questions': questions})

@interview_bp.route('/<int:user_id>/<int:job_id>', methods=['GET'])
@jwt_required()
@role_required('company', 'admin')
def fetch_questions(user_id, job_id):
    q = get_questions_for_candidate(user_id, job_id)
    return jsonify(q if q else {'msg': 'No questions found'})
