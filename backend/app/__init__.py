from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_restx import Api
from dotenv import load_dotenv
import os


load_dotenv()

from app.auth.auth_routes import auth_bp
from app.chatbot.chatbot_routes import chatbot_bp
from app.resume.resume_routes import resume_bp
from app.jobs.job_routes import job_bp
from app.application.application_routes import application_bp
from app.feedback.feedback_routes import feedback_bp
from app.admin.admin_routes import admin_bp
from app.interview.interview_routes import interview_bp

REQUIRED_ENV_VARS = [
    "SECRET_KEY",
    "JWT_SECRET_KEY",
    "MYSQL_HOST",
    "MYSQL_USER",
    "MYSQL_PASSWORD",
    "MYSQL_DB",
    "OPENROUTER_API_KEY"
]

def validate_env_vars():
    missing = [var for var in REQUIRED_ENV_VARS if not os.getenv(var)]
    if missing:
        raise RuntimeError(f"Missing required environment variables: {', '.join(missing)}")

def create_app():
    validate_env_vars()

    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
    app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
    
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

    jwt = JWTManager(app)
    api = Api(app, doc='/docs')

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(chatbot_bp, url_prefix="/api/chat")
    app.register_blueprint(resume_bp, url_prefix="/api/resume")
    app.register_blueprint(job_bp, url_prefix="/api/job")
    app.register_blueprint(application_bp, url_prefix="/api/apply")
    app.register_blueprint(feedback_bp, url_prefix="/api/feedback")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(interview_bp, url_prefix="/api/interview")


    return app
