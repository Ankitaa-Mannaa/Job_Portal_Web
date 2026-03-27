from flask_jwt_extended import verify_jwt_in_request, get_jwt
from functools import wraps
from flask import abort

def role_required(*allowed_roles):  # Accept multiple roles
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            user_role = claims.get("role")

            if user_role not in allowed_roles:
                abort(403)
            return func(*args, **kwargs)
        return wrapper
    return decorator
