import re
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, decode_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from app.db import get_db_connection
from app.role.role_models import get_role_by_name, create_role
from app.user.user_models import create_user, get_user_by_email
from app.auth.email_utils import send_reset_email

auth_bp = Blueprint('auth', __name__)

EMAIL_REGEX = r'^[\w\.-]+@[\w\.-]+\.\w{2,4}$'

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Sanitize input
    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()
    username = data.get('username', '').strip() or email.split('@')[0]
    role = data.get('role', 'candidate').lower()

    #  Validate inputs
    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400
    if not re.match(EMAIL_REGEX, email):
        return jsonify({"msg": "Invalid email format"}), 400
    if len(password) < 6:
        return jsonify({"msg": "Password must be at least 6 characters"}), 400
    if not username:
        return jsonify({"msg": "Username is required"}), 400

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) AS count FROM users")
            user_count = cursor.fetchone()['count']

            if get_user_by_email(email):
                return jsonify({"msg": "Email already exists"}), 400

            if user_count == 0:
                role = 'admin'
            if role not in ['admin', 'candidate', 'company']:
                return jsonify({"msg": f"Invalid role: {role}"}), 400

            role_row = get_role_by_name(role)
            if not role_row:
                create_role(role)
                role_row = get_role_by_name(role)

            hashed = generate_password_hash(password)
            create_user(username, email, hashed, role_row['id'])

            conn.commit()
            return jsonify({"msg": f"User registered as {role}"}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"msg": "Registration failed", "error": str(e)}), 500
    finally:
        conn.close()



@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()

    if not email or not password:
        return jsonify({"msg": "Email and password required"}), 400

    if not re.match(EMAIL_REGEX, email):
        return jsonify({"msg": "Invalid email format"}), 400

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # 1. Fetch user
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()

            if not user or not check_password_hash(user['password_hash'], password):
                return jsonify({"msg": "Invalid credentials"}), 401

            # 2. Get role name from role_id
            cursor.execute("SELECT name FROM roles WHERE id = %s", (user['role_id'],)) 
            role_row = cursor.fetchone()
            role = role_row['name'] if role_row else 'candidate'

            # 3. Embed both id and role into JWT
            token = create_access_token(
                identity=str(user['id']),
                additional_claims={"role": role}
            )
            return jsonify(access_token=token), 200

    except Exception as e:
        return jsonify({"msg": "Login error", "error": str(e)}), 500
    finally:
        conn.close()


@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    try:
        email = request.json.get('email', '').strip().lower()
        if not email:
            return jsonify({"msg": "Email is required"}), 400
        if not re.match(EMAIL_REGEX, email):
            return jsonify({"msg": "Invalid email format"}), 400

        user = get_user_by_email(email)
        if not user:
            return jsonify({"msg": "User not found"}), 404

        token = create_access_token(identity={"id": user['id'], "role": "reset"}, expires_delta=False)
        send_reset_email(email, token)
        return jsonify({"msg": "Reset email sent (mocked)"})

    except Exception as e:
        return jsonify({"msg": "Forgot password failed", "error": str(e)}), 500


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    token = request.json.get('token')
    new_password = request.json.get('password')

    if not token or not new_password:
        return jsonify({"msg": "Token and new password are required"}), 400
    if len(new_password.strip()) < 6:
        return jsonify({"msg": "Password must be at least 6 characters"}), 400

    try:
        identity = decode_token(token)['sub']
        user_id = int(get_jwt_identity())
        hashed = generate_password_hash(new_password)
    except Exception as e:
        return jsonify({"msg": "Invalid or expired token", "error": str(e)}), 400

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "UPDATE users SET password_hash=%s WHERE id=%s",
                (hashed, user_id)
            )
            conn.commit()
            return jsonify({"msg": "Password reset successful"})
    except Exception as e:
        conn.rollback()
        return jsonify({"msg": "Password reset failed", "error": str(e)}), 500
    finally:
        conn.close()
