import json
from flask import Flask
from werkzeug.exceptions import HTTPException


def init_app():
    """Initialize the core application."""
    app = Flask(__name__, instance_relative_config=False)

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

    with app.app_context():
        # Include our Routes
        #from .posts import routes
        # Register Blueprints
        #app.register_blueprint(posts.routes.posts_bp)

        return app