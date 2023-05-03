from datetime import datetime as dt
import json

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
    json = user.json
    json.update({"friended":current_user in user.friends})
    json.update({"incoming":current_user.id in map(lambda req: req.recipient.id, user.friend_requests_sent)})
    json.update({"outgoing":current_user.id in map(lambda req: req.sender.id, user.friend_requests_recieved)})
    return json

@users_bp.route('/users/search', methods=['GET'])
def usersearch():
    args = request.args
    userN = args.get('search')
    if userN == '':
        search = ''
    else:
        search = '%{}%'.format(userN)

    users = User.query.filter(User.plate.like(search)).all()
    user_list = [user.json for user in users]
    print(user_list)
    return user_list

@users_bp.route('/users/location', methods=['POST'])
def setlocation():
    location = request.json['location']

    current_user.location = location
    print(current_user.location)
    db.session.commit()  # Commits all changes

    return "", 201

@users_bp.route('/users/update', methods=['POST'])
def updateuser():
    print(request.json)
    

    name = request.json['user_name']
    bio = request.json['bio']
    plate = request.json['plate']
    plate_state = request.json['plateState']

    print(plate)


    if plate:
        temp = User.query.filter_by(plate=plate).first()
        if temp and temp.id != current_user.id:
            raise Conflict("Plate is already linked with an account")
        current_user.plate = plate
        current_user.linked = True
        temp = User.query.filter_by(plate=plate).first()
    
    current_user.name = name
    current_user.bio = bio
    current_user.plate_state = plate_state

    print(current_user.linked)




    db.session.commit()

    return "", 200