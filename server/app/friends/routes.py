from datetime import datetime as dt

from flask import Blueprint, request, render_template, make_response, abort, make_response
from flask import current_app as app
from flask_login import login_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.exceptions import Unauthorized, UnprocessableEntity, Conflict

from ..models import db, User


@auth_bp.route('friends/add', methods=['POST'])
def addfriend():
    friend_username = request.json['friend_username']
    friend_id = request.json['friend_id']
    username = request.json['username']
    user_id = request.json['user_id']
    for i in User.query.filter_by(id=user_id).first().friends: # makes sure there are no duplicate friends
        if i.friend_username == friend_username:
            raise Conflict('They are already your friend.')

    User1 = User.query.filter_by(id=user_id).first()
    User2 = User.query.filter_by(id=friend_id).first()
    User1.friends.append(User2)
    User2.friends.append(User1)


@auth_bp.route('friends/get', methods=['GET'])
def getfriends():
    user_id = request.json['user_id']

    return User.filter_by(id=user_id).first().friends
