from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.resume.resume_models import get_resume_text_by_user
from app.chatbot.ai_chatbot import generate_chat
from app.access_control import role_required
from app.chatbot.chatbot_models import save_chat_history, get_chat_history


chatbot_bp = Blueprint('chatbot', __name__)


@chatbot_bp.route('/', methods=['POST'])
@jwt_required()
@role_required('candidate')
def chat_about_resume():
    user_id = get_jwt_identity()['id']
    data = request.get_json()
    question = data.get("question")

    if not question:
        return jsonify({"msg": "Question is required"}), 400

    context = get_resume_text_by_user(user_id)
    if not context:
        return jsonify({"msg": "Resume not found"}), 404

    answer = generate_chat(question, context)

    try:
        save_chat_history(user_id, question, answer)
    except Exception as e:
        return jsonify({"msg": "Chat saved failed", "error": str(e)}), 500

    return jsonify({"answer": answer})


@chatbot_bp.route('/history', methods=['GET'])
@jwt_required()
@role_required('candidate')
def view_chat_history():
    user_id = get_jwt_identity()['id']
    history = get_chat_history(user_id)
    return jsonify(history)
