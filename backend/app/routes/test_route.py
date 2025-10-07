from flask import jsonify
from flask_jwt_extended import jwt_required

from app.routes import bp
from app.utils.decorators import role_required


@bp.get('test/jwt')
@jwt_required()
@role_required(['admin'])
def jwt_test():
    return jsonify({"msg": "jwt works!"
                    }),200