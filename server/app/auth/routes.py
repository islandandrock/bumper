from flask import Blueprint, request, render_template, make_response, abort, make_response
from flask import current_app as app
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.exceptions import Unauthorized, UnprocessableEntity, Conflict

# Blueprint Configuration
auth_bp = Blueprint('auth_bp', __name__)

@app.route('/signup', methods=['POST'])
def signup():
    """Create a user."""
    
    return "", 201
