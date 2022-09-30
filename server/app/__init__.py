import json
from flask import Flask
from werkzeug.exceptions import HTTPException
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_app():
    """Initialize the core application."""
    app = Flask(__name__, instance_relative_config=False)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"

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

    with app.app_context():
        # Include our Routes
        from .auth import routes
        db.create_all()
        
        # Register Blueprints
        app.register_blueprint(auth.routes.auth_bp)

        return app