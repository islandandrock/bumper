from datetime import datetime as dt

from flask import Blueprint, request, render_template, make_response, abort, make_response
from flask import current_app as app
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