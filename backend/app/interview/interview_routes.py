from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.access_control import role_required
from app.interview.interview_tasks import generate_interview_task
from app.resume.resume_models import get_resume_text_by_user
from app.jobs.job_models import get_job_by_id
from app.interview.interview_generator import generate_questions
from app.interview.interview_models import save_questions
from app.interview.interview_generator import generate_questions
from app.interview.interview_models import save_questions

interview_bp = Blueprint('interview', __name__)


@interview_bp.route('/assign', methods=['POST'])
@jwt_required()
@role_required('company', 'admin')
def assign_interview():
    try:
        identity = get_jwt_identity()  
        claims = get_jwt()             

        hr_id = int(identity)
        role = claims.get("role")

        if role not in ['company', 'admin']:
            return jsonify({'msg': 'Unauthorized role'}), 403

        data = request.get_json()
        job_id = int(data.get('job_id', 0))
        candidate_id = int(data.get('user_id', 0))

        if not job_id or not candidate_id:
            return jsonify({'msg': 'user_id and job_id are required'}), 400

        job = get_job_by_id(job_id)
        if not job:
            return jsonify({'msg': 'Job not found'}), 404
        if job["posted_by"] != hr_id:
            return jsonify({'msg': 'You do not own this job'}), 403

        resume_text = get_resume_text_by_user(candidate_id)
        if not resume_text:
            return jsonify({'msg': 'Resume not found for candidate'}), 404

        questions = generate_questions(resume_text, job['description'])
        save_questions(candidate_id, job_id, questions)

        return jsonify({
            'msg': 'Questions assigned successfully',
            'questions': questions
        }), 200
 
        # ---------------------------------
        # Celery logic for production (off)
        # ---------------------------------
        # task = generate_interview_task.delay(candidate_id, job_id)
        # return jsonify({'msg': 'Interview generation started.', 'task_id': task.id}), 202

    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({'msg': 'Assignment failed', 'error': str(e)}), 500


from app.interview.interview_models import get_questions_for_candidate

@interview_bp.route('/assigned/<int:job_id>', methods=['GET'])
@jwt_required()
@role_required('candidate')
def get_assigned_questions(job_id):
    user_id = int(get_jwt_identity())
    if isinstance(user_id, dict):
        user_id = user_id.get('id')

    questions = get_questions_for_candidate(user_id, job_id)
    if not questions:
        return jsonify({'msg': 'No interview questions found'}), 404

    return jsonify({'questions': questions}), 200
