from datetime import datetime as dt
import random

from flask import Blueprint, request, render_template, make_response, abort, make_response, session
from flask import current_app as app
from flask_login import login_user, current_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.exceptions import Unauthorized, UnprocessableEntity, Conflict, NotFound, BadRequest

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
        linked=False,
        email_verified=False
    )

    new_user.plate="ABC"+str(random.randint(0, 1000))

    db.session.add(new_user)  # Adds new User record to database
    db.session.commit()  # Commits all changes
    user = User.query.filter_by(email=email).first()  # Get user again
    user.plate = f"---{user.id:03d}"
    db.session.add(user)
    db.session.commit()

    session['to_email'] = email

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

@auth_bp.route('/sendcode', methods=['POST'])
def sendcode():
    to_email = session['to_email']
    send_verification(to_email)
    return {"sent":True}, 200

@app.route('/verifyme', methods=['POST'])
def checkcode():
    args = request.args
    verification_code = request.json['verification_code']
    to_email = session['to_email']
    #verification_code = request.form['verificationcode']
    if check_verification_token(to_email, verification_code):
        return {"successful":True}, 200
    else:
        raise BadRequest("Invalid verification code. Please try again.")

def send_verification(to_email):
    verification = app.twilio_client.verify \
        .services(app.config["TWILIO_VERIFY_SERVICE"]) \
        .verifications \
        .create(to=to_email, channel='email')
    print(verification.sid)

def check_verification_token(phone, token):
    check = app.twilio_client.verify \
        .services(app.config["TWILIO_VERIFY_SERVICE"]) \
        .verification_checks \
        .create(to=phone, code=token)
    return check.status == 'approved'
