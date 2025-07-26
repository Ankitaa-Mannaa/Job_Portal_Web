from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.access_control import role_required
from app.jobs.job_models import create_job, get_job_by_id, update_job_by_id, delete_job_by_id

job_bp = Blueprint('job', __name__)

@job_bp.route('/', methods=['POST'])
@jwt_required()
@role_required('company', 'admin')
def post_job():
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    posted_by = get_jwt_identity()['id']

    if not title or not description:
        return jsonify({"msg": "Title and description required"}), 400

    try:
        job_id = create_job(title, description, posted_by)
        return jsonify({'msg': 'Job posted successfully', 'job_id': job_id}), 201
    except Exception as e:
        return jsonify({'msg': 'Failed to create job', 'error': str(e)}), 500


@job_bp.route('/<int:job_id>', methods=['GET'])
@jwt_required()
@role_required('candidate', 'company', 'admin')
def fetch_job(job_id): 
    try:
        job = get_job_by_id(job_id)
        if not job:
            return jsonify({'msg': 'Job not found'}), 404
        return jsonify(job)
    except Exception as e:
        return jsonify({'msg': 'Error retrieving job', 'error': str(e)}), 500

@job_bp.route('/<int:job_id>', methods=['PUT'])
@jwt_required()
@role_required('company', 'admin')
def update_job(job_id):
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')

    if not title or not description:
        return jsonify({'msg': 'Title and description required'}), 400

    try:
        updated = update_job_by_id(job_id, title, description)
        if updated == 0:
            return jsonify({'msg': 'Job not found'}), 404
        return jsonify({'msg': 'Job updated'})
    except Exception as e:
        return jsonify({'msg': 'Update failed', 'error': str(e)}), 500


@job_bp.route('/<int:job_id>', methods=['DELETE'])
@jwt_required()
@role_required('admin', 'company')
def delete_job(job_id):
    try:
        deleted = delete_job_by_id(job_id)
        if deleted == 0:
            return jsonify({'msg': 'Job not found'}), 404
        return jsonify({'msg': 'Job deleted'})
    except Exception as e:
        return jsonify({'msg': 'Delete failed', 'error': str(e)}), 500