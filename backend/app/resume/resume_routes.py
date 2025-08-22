import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from werkzeug.utils import secure_filename
from app.resume.resume_matching import recommend_jobs_for_candidate
from app.access_control import role_required
from app.resume.resume_tasks import process_resume_task, score_resume_task
from app.resume.resume_score import rule_based_score
from app.resume.resume_models import get_resume_text_by_user, store_resume_score, get_parsed_resume_by_user
from app.jobs.job_models import get_job_by_id
from app.application.application_models import get_applications_by_user


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

        # FOR DEVELOPMENT: run synchronously to avoid Celery
        

        resume_data = {
            "filename": filename,
            "file_url": f"{request.host_url}uploads/{filename}", 
            "status": "active",
            "user_id": user_id
        }

        return jsonify({
            'msg': 'Resume uploaded and processed (synchronously)',
            'result': resume_data
        }), 200

# --------------------------------------------------------------------------------------------

        # Uncomment below for production with Celery
        #task = process_resume_task(user_id, filepath)   # remember to add .delay()
        #return jsonify({
         #   'msg': 'Resume uploaded. Processing in background.',
          #  'task_id': task.id
        #}), 202

# --------------------------------------------------------------------------------------------

    except Exception as e: 
        print("❌ Upload failed:", e)
        import traceback; traceback.print_exc()  # <-- shows full error
        return jsonify({'msg': 'Upload failed', 'error': str(e)}), 500

@resume_bp.route('/recommendations', methods=['GET'])
@jwt_required()
@role_required('candidate')
def get_job_recommendations():
    try:
        user_id = int(get_jwt_identity())
        if not isinstance(user_id, int) or user_id <= 0:
            return jsonify({'msg': 'Invalid user ID in token'}), 400

        results = recommend_jobs_for_candidate(user_id)
        print(f"🔍 Recommendations for user {user_id}: {results}")
        return jsonify(results), 200

    except ValueError as ve:
        return jsonify({'msg': str(ve)}), 400
    except RuntimeError as re:
        return jsonify({'msg': str(re)}), 500
    except Exception as e:
        import traceback; traceback.print_exc()
        print("❌ /recommendations error:", e)
        return jsonify({'msg': 'Unexpected error occurred', 'error': str(e)}), 500


'''@resume_bp.route('/score', methods=['POST'])
@jwt_required()
@role_required('candidate', 'company')
def score_resume():
    try:
        data = request.get_json()

        if not data or 'job_id' not in data:
            return jsonify({"msg": "job_id is required in request body"}), 400

        job_id = int(data.get("job_id"))
        claims = get_jwt_identity()

        # Get the correct user_id (candidate whose resume is being scored)
        role = claims.get('role') if isinstance(claims, dict) else None
        logged_in_user_id = claims.get('id') if isinstance(claims, dict) else int(claims)

        # For company: require candidate user_id in body
        if role == 'company':
            user_id = int(data.get("user_id", 0))
            if user_id <= 0:
                return jsonify({"msg": "user_id is required for company role"}), 400
        else:
            user_id = logged_in_user_id

        if user_id <= 0 or job_id <= 0:
            return jsonify({"msg": "Invalid user_id or job_id"}), 400

        print(f" Logged in as: {claims}")
        print(f" Target resume user_id: {user_id}")

        # ---------------------------
        # LOCAL MODE (no Celery)
        # ---------------------------

        resume_text = get_resume_text_by_user(user_id)
        print(" Resume text is:", resume_text[:100] if resume_text else "❌ None")
        
        job = get_job_by_id(job_id)
        print(" resume_text found:", bool(resume_text))
        print(" job found:", job["title"] if job else " None")

        if not resume_text or not job:
            print(" Missing resume or job for scoring")
            import traceback; traceback.print_exc()
            return jsonify({"msg": "Missing resume or job"}), 404

        score = score_resume_against_job(resume_text, job["description"])
        return jsonify({
            "msg": "Scored resume successfully (direct mode)",
            "score": score
        }), 200

        # -----------------------------------------
        # PROD MODE (uncomment this block for Celery)
        # -----------------------------------------
        # task = score_resume_task.delay(user_id, job_id)
        # return jsonify({
        #     "msg": "Resume scoring started.",
        #     "task_id": task.id
        # }), 202

    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({
            "msg": "Unexpected error occurred.",
            "error": str(e)
        }), 500'''



@resume_bp.route('/score', methods=['POST'])
@jwt_required()
@role_required('company')
def score_resume_by_company():
    try:
        user_id_str = get_jwt_identity()           
        claims = get_jwt()                       
        hr_id = int(user_id_str)

        data = request.get_json()
        candidate_id = int(data.get('user_id', 0))
        job_id = int(data.get('job_id', 0))

        if not candidate_id or not job_id:
            return jsonify({'msg': 'user_id and job_id are required'}), 400

        print(" HR ID:", hr_id)
        print(" Input Data:", data)

        # Validate job ownership
        job = get_job_by_id(job_id)
        if not job:
            return jsonify({'msg': 'Job not found'}), 404
        if job['posted_by'] != hr_id:
            return jsonify({'msg': 'You do not own this job'}), 403

        # Validate candidate applied
        apps = get_applications_by_user(candidate_id)
        applied_job_ids = [a['job_id'] for a in apps]
        if job_id not in applied_job_ids:
            return jsonify({'msg': 'Candidate has not applied to this job'}), 403

        # Retrieve resume
        parsed_resume = get_parsed_resume_by_user(candidate_id)
        score = rule_based_score(parsed_resume, job['description'])
        store_resume_score(candidate_id, job_id, score)

        return jsonify({
            'msg': 'Resume scored successfully',
            'score': score
        }), 200

    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({'msg': 'Failed to score resume', 'error': str(e)}), 500
