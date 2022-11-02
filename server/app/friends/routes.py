from datetime import datetime as dt

from flask import Blueprint, request, render_template, make_response, abort, make_response
from flask import current_app as app
from flask_login import login_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.exceptions import Unauthorized, UnprocessableEntity, Conflict

from ..models import db, User

friends_bp = Blueprint('friends_bp', __name__)

@friends_bp.route('/friends/add', methods=['POST'])
def addfriend():
    friend_id = request.json['friend_id']
    friend = User.query.filter_by(id=friend_id).first()
    if not friend_id or not friend:
        return UnprocessableEntity("You must specify a valid friend_id.")
    for i in current_user.friends: # makes sure there are no duplicate friends
        if i.username == friend.username:
            raise Conflict('They are already your friend.')

    current_user.friends.append(friend)
    friend.friends.append(current_user)

    db.session.commit()

    return {}, 200


@friends_bp.route('/friends/get', methods=['GET'])
def getfriends():
    args = request.args
    user_id = args.get('user_id')
    print("user id: ", user_id)

    user_friends = User.query.filter_by(id=user_id).first().friends
    friends = [{'username':friend.username, 'password':friend.password, 'email':friend.email, 'created':friend.created, 'bio':friend.bio, 'admin':friend.admin} for friend in user_friends]

    return friends
