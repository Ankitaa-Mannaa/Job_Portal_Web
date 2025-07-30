from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.access_control import role_required
from app.interview.interview_tasks import generate_interview_task


interview_bp = Blueprint('interview', __name__)

@interview_bp.route('/assign-async', methods=['POST'])
@jwt_required()
@role_required('company', 'admin', 'candidate')
def assign_interview_async():
    try:
        data = request.get_json()
        job_id = data.get('job_id')
        role = get_jwt_identity().get('role')
        token_user_id = get_jwt_identity().get('id')

        # Get user_id from request only if not a candidate
        if role in ['admin', 'company']:
            user_id = data.get('user_id')
            if not user_id:
                return jsonify({'msg': 'user_id is required'}), 400
        else:
            user_id = token_user_id  # force candidate's own ID

        # Validate input
        if not isinstance(user_id, int) or not isinstance(job_id, int):
            return jsonify({'msg': 'user_id and job_id must be integers'}), 400

        task = generate_interview_task.delay(user_id, job_id)
        return jsonify({'msg': 'Interview generation started.', 'task_id': task.id}), 202

    except Exception as e:
        return jsonify({'msg': 'Unexpected error occurred', 'error': str(e)}), 500
