from datetime import datetime as dt

from flask import Blueprint, request, render_template, make_response, abort, make_response
from flask import current_app as app
from flask_login import current_user
from werkzeug.exceptions import Unauthorized, UnprocessableEntity, Conflict, NotFound

from ..models import db, User

# Blueprint Configuration
users_bp = Blueprint('users_bp', __name__)

@users_bp.route('/users/get', methods=['GET'])
def getuser():
    args = request.args
    user_id = args.get("id")
    try:
        user_id = int(user_id)
    except:
        raise UnprocessableEntity("Please specify ID")
    user = User.query.filter_by(id=user_id).first()
    if not user:
        raise NotFound("User not found")
    return {'plate':user.plate, 'name':user.name, 'password':user.password, 'email':user.email, 'created':user.created, 'bio':user.bio, 'admin':user.admin}

@users_bp.route('/users/search', methods=['GET'])
def usersearch():
    args = request.args
    userN = args.get('search')
    if userN == '':
        search = ''
    else:
        search = '%{}%'.format(userN)

    users = User.query.filter(User.plate.like(search)).all()
    user_list = [{'id':user.id, 'plate':user.plate, 'name':user.name, 'password':user.password, 'email':user.email, 'created':user.created, 'bio':user.bio, 'admin':user.admin} for user in users]
    print(user_list)
    return user_list

    
