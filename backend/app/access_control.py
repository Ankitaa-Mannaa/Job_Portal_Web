from flask import abort
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from functools import wraps

def role_required(*allowed_roles):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            role = get_jwt_identity().get("role")
            if role not in allowed_roles:
                abort(403, f"Access denied for role: {role}")
            return func(*args, **kwargs)
        return wrapper
    return decorator
