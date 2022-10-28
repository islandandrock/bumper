from datetime import datetime as dt

from flask import Blueprint, request, render_template, make_response, abort, make_response
from flask import current_app as app
from flask_login import login_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.exceptions import Unauthorized, UnprocessableEntity, Conflict

from ..models import db, User

# Blueprint Configuration
auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """Create a user."""
    username = request.json['username']
    email = request.json['email']
    password = request.json['password']
    
    if not (username and email and password):
        raise UnprocessableEntity("Missing parameters.")

    if User.query.filter_by(email=email).first():
        raise Conflict("Email is already registered.")
    if User.query.filter_by(username=username).first():
        raise Conflict("Username is taken.")
    
    new_user = User(
        username=username,
        email=email,
        password=generate_password_hash(password, method='sha256'),
        created=dt.now(),
        bio="Default Bio",
        admin=False
    )
    db.session.add(new_user)  # Adds new User record to database
    db.session.commit()  # Commits all changes
    return "", 201

@auth_bp.route('/signin', methods=['POST'])
def signin():
    """Sign in to the app."""
    email = request.json['email']
    password = request.json['password']
    if not (email and password):
        raise UnprocessableEntity("Missing parameters!")
    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        login_user(user)
        return {"username":user.username, "user_id":user.id}, 200
    raise Unauthorized("Username or Password doesn't match.")

@auth_bp.route('/users/search', methods=['GET'])
def usersearch():
    args = request.args
    search = args.get('search')

    users = User.query.filter_by(username=search)
    user_list = [{'username':user.username, 'password':user.password, 'email':user.email, 'created':user.created, 'bio':user.bio, 'admin':user.admin} for user in users]
    print(user_list)
    return user_list

    
