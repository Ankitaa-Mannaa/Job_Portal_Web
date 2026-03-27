import re
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, decode_token, get_jwt_identity, jwt_required, get_jwt
from werkzeug.security import generate_password_hash, check_password_hash
from app.db import get_db_connection
from app.role.role_models import get_role_by_name, create_role
from app.user.user_models import create_user, get_user_by_email, update_user_by_id
from app.auth.email_utils import send_reset_email
import pymysql.cursors
import traceback

auth_bp = Blueprint('auth', __name__)

EMAIL_REGEX = r'^[\w\.-]+@[\w\.-]+\.\w{2,4}$'
FRONTEND_RESET_URL = "http://localhost:3004/reset-password"

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
        print(" Forgot password request for:", email)

        if not email:
            return jsonify({"msg": "Email is required"}), 400
        if not re.match(EMAIL_REGEX, email):
            return jsonify({"msg": "Invalid email format"}), 400

        user = get_user_by_email(email)
        if not user:
            print(" User not found for email:", email)
            return jsonify({"msg": "User not found"}), 404

        # Use string user ID as identity, and set role in claims
        token = create_access_token(
            identity=str(user['id']),
            additional_claims={"role": "reset"},
            expires_delta=False  # Optional: set to timedelta(minutes=15) for security
        )

        reset_link = f"{FRONTEND_RESET_URL}?token={token}"
        print(" Generated reset link:", reset_link)

        # Simulate email
        return jsonify({
            "msg": "Reset email sent (mocked)",
            "reset_link": reset_link
        })

    except Exception as e:
        print(" Forgot password error:", str(e))
        return jsonify({"msg": "Forgot password failed", "error": str(e)}), 500


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    token = request.json.get('token')
    new_password = request.json.get('password')

    print(" Reset request received")
    print(" Token received:", bool(token))
    print(" New password received:", bool(new_password))

    if not token or not new_password:
        return jsonify({"msg": "Token and new password are required"}), 400
    if len(new_password.strip()) < 6:
        return jsonify({"msg": "Password must be at least 6 characters"}), 400

    try:
        decoded = decode_token(token)
        user_id = int(decoded['sub'])  
        print(" Token decoded. User ID:", user_id)

        hashed = generate_password_hash(new_password)

    except Exception as e:
        print(" Token decoding failed:", str(e))
        return jsonify({"msg": "Invalid or expired token", "error": str(e)}), 400

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "UPDATE users SET password_hash=%s WHERE id=%s",
                (hashed, user_id)
            )
            conn.commit()
            print(" Password updated for user:", user_id)
            return jsonify({"msg": "Password reset successful"})
    except Exception as e:
        conn.rollback()
        print(" Password reset DB error:", str(e))
        return jsonify({"msg": "Password reset failed", "error": str(e)}), 500
    finally:
        conn.close()


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        user_id = int(get_jwt_identity())
        claims = get_jwt()
        role = claims.get('role')

        conn = get_db_connection()
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("SELECT id, email, username FROM users WHERE id = %s", (user_id,))
            user = cursor.fetchone()

        if not user:
            return jsonify({"msg": "User not found"}), 404

        return jsonify({
            "id": user["id"],
            "role": role,
            "name": user["username"],
            "email": user["email"]
        })

    except Exception as e:
        print(" /me error:", e)
        return jsonify({"msg": "Internal server error", "error": str(e)}), 500



@auth_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_me():

    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()

        name = data.get('name', '').strip()
        email = data.get('email', '').strip()

        if not name or not email:
            return jsonify({"msg": "Name and email are required"}), 400

        update_user_by_id(user_id, name, email)
        return jsonify({
            "msg": "User profile updated successfully",
            "user": {
                "id": user_id,
                "name": name,
                "email": email
            }
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "msg": "Update failed",
            "error": str(e)
        }), 500
