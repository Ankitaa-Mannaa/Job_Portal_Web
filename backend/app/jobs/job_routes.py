from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.access_control import role_required
from app.jobs.job_models import (create_job, 
                                 get_job_by_id, 
                                 update_job_by_id, 
                                 delete_job_by_id, 
                                 get_all_jobs_from_db, 
                                 get_jobs_by_company)
from app.jobs.job_vectorstore import add_job_embedding
from app.user.user_models import get_user_by_id
from app.jobs.job_vectorstore import add_job_embedding

job_bp = Blueprint('job', __name__)

@job_bp.route('/', methods=['POST'])
@jwt_required()
@role_required('company', 'admin')
def post_job():
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    posted_by = get_jwt_identity()

    if not title or not description:
        return jsonify({"msg": "Title and description required"}), 400

    try:
        job_id = create_job(title, description, posted_by)
        add_job_embedding(job_id, description)  # Embed after DB insert

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


@job_bp.route('/', methods=['GET'])
@jwt_required()
@role_required('admin', 'candidate', 'company')  # Added 'candidate'
def get_all_jobs():
    try:
        identity = get_jwt_identity()
        role = get_jwt().get('role')

        if role == 'admin':
            jobs = get_all_jobs_from_db()
        elif role == 'company': 
            company_id = int(identity)
            jobs = get_jobs_by_company(company_id)
        elif role == 'candidate':
            jobs = get_all_jobs_from_db()  # Candidate sees all jobs
        else:
            return jsonify({'msg': 'Unauthorized'}), 403

        enriched_jobs = []
        if jobs:
            for job in jobs:
                company_user = get_user_by_id(job.get('posted_by'))
                enriched_jobs.append({
                    'id': job['id'],
                    'title': job['title'],
                    'description': job['description'], 'posted_by': job['posted_by'],
                    'company_name': company_user['username'] if company_user else 'Unknown'
                }) 

        return jsonify(enriched_jobs)
    except Exception as e:
        print('❌ Error fetching jobs:', e)
        return jsonify({'msg': 'Failed to retrieve jobs', 'error': str(e)}), 500