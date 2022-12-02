from datetime import datetime as dt
import random

from flask import Blueprint, request, render_template, make_response, abort, make_response
from flask import current_app as app
from flask_login import login_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.exceptions import Unauthorized, UnprocessableEntity, Conflict, NotFound

from ..models import db, User

# Blueprint Configuration
auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """Create a user."""
    email = request.json['email']
    password = request.json['password']
    
    if not (email and password):
        raise UnprocessableEntity("Missing parameters.")

    if User.query.filter_by(email=email).first():
        raise Conflict("Email is already registered.")

    new_user = User(
        email=email,
        plate=email,
        password=generate_password_hash(password, method='sha256'),
        created=dt.now(),
        bio="Default Bio",
        admin=False,
        linked=False
    )

    new_user.plate="ABC"+str(random.randint(0, 1000))

    db.session.add(new_user)  # Adds new User record to database
    db.session.commit()  # Commits all changes
    user = User.query.filter_by(email=email).first()  # Get user again
    user.plate = f"---{user.id:03d}"
    db.session.add(user)
    db.session.commit()
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
        return {"name":user.name, "user_id":user.id}, 200
    raise Unauthorized("Email or Password doesn't match.")
