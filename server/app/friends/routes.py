from datetime import datetime as dt
import re

from flask import Blueprint, request, render_template, make_response, abort, make_response
from flask import current_app as app
from flask_login import login_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.exceptions import Unauthorized, UnprocessableEntity, Conflict

from ..models import db, User, FriendRequest

friends_bp = Blueprint('friends_bp', __name__)

@friends_bp.route('/friends/add', methods=['POST'])
def addfriend():
    friend_id = request.json['friend_id']
    if not friend_id:
        return UnprocessableEntity("You must specify a valid friend_id.")
    friend = User.query.get(friend_id)
    if not friend:
        return UnprocessableEntity("You must specify a valid friend_id.")
    for i in current_user.friends: # makes sure there are no duplicate friends
        if i.id == friend.id:
            raise Conflict('They are already your friend.')
    for i in current_user.friend_requests_sent:
        if i.recipient.id == friend.id:
            raise Conflict('You already sent this user a friend request.')
    for i in current_user.friend_requests_recieved:
        if i.sender.id == friend.id:
            raise Conflict('You have a request from this user.') # FIX THIS BEHAVIOR LATER

    new_request = FriendRequest(sender_id=current_user.id, recipient_id=friend_id, date_sent="x")
    db.session.add(new_request)
    db.session.commit()

    return {}, 200

@friends_bp.route('/friends/requests', methods=['GET'])
def get_friend_requests():
    requests = [{"user": r.sender.json, "date": r.date_sent} for r in current_user.friend_requests_recieved]

    return requests, 200

@friends_bp.route('/friends/accept', methods=['POST'])
def accept_friend_request():
    friend_id = request.json['friend_id']
    if not friend_id:
        return UnprocessableEntity("You must specify a valid friend_id.")
    friend = User.query.get(friend_id)
    if not friend:
        return UnprocessableEntity("You must specify a valid friend_id.")
    for i in current_user.friend_requests_recieved:
        if i.sender.id == friend_id:
            db.session.delete(i)
            current_user.friends.append(friend)
            friend.friends.append(current_user)
            db.session.commit()
            return 200
    else:
        return UnprocessableEntity("You don't have a request from this user.")

@friends_bp.route('/friends/remove', methods=['POST'])
def remove_friend_request():
    pass #ADD ME


@friends_bp.route('/friends/get', methods=['GET'])
def getfriends():
    args = request.args
    user_id = args.get('user_id')
    print("user id: ", user_id)

    user_friends = User.query.filter_by(id=user_id).first().friends
    friends = [friend.json for friend in user_friends]

    return friends

@friends_bp.route('/friends/search', methods=['GET'])
def searchfriends():
    args = request.args
    query = args.get('search')

    user_friends = current_user.friends
    friends = [friend for friend in user_friends if re.match(query, str(friend.name),  re.IGNORECASE) or re.match(query, friend.plate,  re.IGNORECASE)]
    friend_list = [friend.json for friend in friends]
    return friend_list