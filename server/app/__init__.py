import json
from flask import Flask
from werkzeug.exceptions import HTTPException
from flask_login import LoginManager
from .extensions import db
from .models import User
from datetime import datetime as dt

login_manager = LoginManager()

def init_app():
    """Initialize the core application."""
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object('config.Config')

    @app.errorhandler(HTTPException)
    def handle_exception(e):
        """Return JSON instead of HTML for HTTP errors."""
        # start with the correct headers and status code from the error
        response = e.get_response()
        # replace the body with JSON
        response.data = json.dumps({
            "code": e.code,
            "name": e.name,
            "description": e.description,
        })
        response.content_type = "application/json"
        return response

    db.init_app(app)
    login_manager.init_app(app)
    
    from .models import User

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    with app.app_context():
        # Include our Routes
        from .auth import routes
        from .connections import routes
        db.create_all()
        db.session.commit()
        
        # Register Blueprints
        app.register_blueprint(auth.routes.auth_bp)
        app.register_blueprint(connections.routes.connections_bp)

        return app