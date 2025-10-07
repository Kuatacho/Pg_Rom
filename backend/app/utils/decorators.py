from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from functools import wraps

def role_required(roles):
    #decorador para restringir acceso segun rol del user
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            #verifica token valido en solicitud
            verify_jwt_in_request()
            # obtiene datos de claims guardados en jwt
            claims = get_jwt()
            user_role= claims.get('role')
            #compara el rol del user con roles permitidos
            if user_role not in roles:
                return jsonify({
                    "message": "Unauthorized",
                    "rol_actual": user_role,
                    "roles_permitidos":roles
                }),403
            #si el rol es valido ejecuta funcion orignal
            return fn(*args, **kwargs)
        return decorator
    return wrapper

