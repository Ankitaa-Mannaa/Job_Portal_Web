from flask import Blueprint, jsonify, send_file
from flask_jwt_extended import jwt_required
from app.access_control import role_required
from app.admin.stats import (
    get_user_stats,
    get_job_stats,
    get_avg_resume_scores,
    get_dropoff_data,
    export_report_csv
)

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/user-stats', methods=['GET'])
@jwt_required()
@role_required('admin')
def user_stats():
    return jsonify(get_user_stats())

@admin_bp.route('/job-stats', methods=['GET'])
@jwt_required()
@role_required('admin')
def job_stats():
    return jsonify(get_job_stats())

@admin_bp.route('/resume-scores', methods=['GET'])
@jwt_required()
@role_required('admin')
def resume_scores():
    return jsonify(get_avg_resume_scores())

@admin_bp.route('/dropoff-analytics', methods=['GET'])
@jwt_required()
@role_required('admin')
def dropoff():
    return jsonify(get_dropoff_data())

@admin_bp.route('/export-report', methods=['GET'])
@jwt_required()
@role_required('admin')
def export():
    file_path = export_report_csv()
    return send_file(file_path, as_attachment=True)
