import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from app.resume.resume_matching import recommend_jobs_for_candidate
from app.access_control import role_required
from app.resume.resume_tasks import process_resume_task
from app.resume.resume_tasks import score_resume_task

resume_bp = Blueprint('resume', __name__)

UPLOAD_FOLDER = 'uploaded_resumes'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@resume_bp.route('/upload', methods=['POST'])
@jwt_required()
@role_required('candidate')
def upload_resume():
    user_id = int(get_jwt_identity())
    if 'file' not in request.files:
        return jsonify({'msg': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'msg': 'Filename is empty'}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    try:
        task = process_resume_task.delay(user_id, filepath)
        return jsonify({
            'msg': 'Resume uploaded. Processing in background.',
            'task_id': task.id
        }), 202
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@resume_bp.route('/recommendations', methods=['GET'])
@jwt_required()
@role_required('candidate')
def get_job_recommendations():
    try:
        user_id = get_jwt_identity().get('id')
        if not isinstance(user_id, int) or user_id <= 0:
            return jsonify({'msg': 'Invalid user ID in token'}), 400

        results = recommend_jobs_for_candidate(user_id)
        return jsonify(results), 200

    except ValueError as ve:
        return jsonify({'msg': str(ve)}), 400
    except RuntimeError as re:
        return jsonify({'msg': str(re)}), 500
    except Exception as e:
        return jsonify({'msg': 'Unexpected error occurred', 'error': str(e)}), 500


@resume_bp.route('/score', methods=['POST'])
@jwt_required()
@role_required('candidate')
def score_resume():
    try:
        data = request.get_json()

        if not data or 'job_id' not in data:
            return jsonify({"msg": "job_id is required in request body"}), 400
       
        job_id = data.get("job_id")
        if not isinstance(job_id, int) or job_id <= 0:
            return jsonify({"msg": "job_id must be a positive integer"}), 400

        user_id = get_jwt_identity().get("id")
        if not isinstance(user_id, int) or user_id <= 0:
            return jsonify({"msg": "Invalid user ID in token"}), 400

        task = score_resume_task.delay(user_id, job_id)
        return jsonify({
            "msg": "Resume scoring started.",
            "task_id": task.id
        }), 202

    except ValueError as ve:
        return jsonify({"msg": str(ve)}), 400
    except RuntimeError as re:
        return jsonify({"msg": str(re)}), 500
    except Exception as e:
        return jsonify({
            "msg": "Unexpected error occurred.",
            "error": str(e)
        }), 500

