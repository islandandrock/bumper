from datetime import datetime as dt

from flask import Blueprint, request, render_template, make_response, abort, make_response
from flask import current_app as app
from flask_login import current_user, login_required
from werkzeug.exceptions import Unauthorized, UnprocessableEntity, Conflict, NotFound

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

@connections_bp.route('/connections/get/<user_id>', methods=['GET'])
def get_connections(user_id):
    connections = User.query.filter_by(id=user_id).first().connections
    data = [{"id":connection.id, "app_name":connection.app_name, "link":connection.link} for connection in connections]
    return data, 200

@connections_bp.route('/connections/remove', methods=['POST'])
@login_required
def remove_connection():
    connection_id = request.json['connection_id']
    connection = Connection.query.get(connection_id)
    if connection:
        db.session.delete(connection)
        db.session.commit()
    else:
        raise NotFound("Couldn't find this connection")
    return {}, 200

@connections_bp.route('/connections/edit')
@login_required
def edit_connection():
    pass