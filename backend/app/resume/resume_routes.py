import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename

from app.resume.resume_models import store_parsed_resume
from app.resume.parser import parse_resume
from app.resume.embedder import embed_text
from app.resume.vectorstore import add_resume_embedding
from app.resume.resume_matching import recommend_jobs_for_candidate
from app.access_control import role_required

resume_bp = Blueprint('resume', __name__)

UPLOAD_FOLDER = 'uploaded_resumes'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@resume_bp.route('/upload', methods=['POST'])
@jwt_required()
@role_required('candidate')
def upload_resume():
    user_id = get_jwt_identity()['id']
    if 'file' not in request.files:
        return jsonify({'msg': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'msg': 'Filename is empty'}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    try:
        text = parse_resume(filepath)
        embedding = embed_text(text)

        store_parsed_resume(user_id, filepath, text)
        add_resume_embedding(user_id, embedding)

        return jsonify({'msg': 'Resume uploaded and processed successfully'})
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

