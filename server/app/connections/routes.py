from datetime import datetime as dt

from flask import Blueprint, request, render_template, make_response, abort, make_response
from flask import current_app as app
from flask_login import current_user, login_required
from werkzeug.exceptions import Unauthorized, UnprocessableEntity, Conflict

from ..models import db, User, Connection

# Blueprint Configuration
connections_bp = Blueprint('account_bp', __name__)

@connections_bp.route('/connections/add', methods=['POST'])
@login_required
def add_connection():
    """Add a connection to an external app account"""

    app_name = request.json['app_name']
    link = request.json['link']
    
    if not (link and app):
        raise UnprocessableEntity("Missing parameters.")

    new_connection = Connection(user_id=current_user.id, link=link, app_name=app_name)
    
    db.session.add(new_connection)  # Adds new Connection record to database
    db.session.commit()  # Commits all changes
    return "", 201

@connections_bp.route('/connections/remove')
@login_required
def remove_connection():
    pass

@connections_bp.route('/connections/edit')
@login_required
def edit_connection():
    pass