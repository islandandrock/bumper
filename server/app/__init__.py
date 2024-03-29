import json
from flask import Flask
from werkzeug.exceptions import HTTPException
from flask_login import LoginManager
from flask_migrate import Migrate
from .extensions import db
from .models import User
from datetime import datetime as dt
from twilio.rest import Client
from dotenv import dotenv_values

login_manager = LoginManager()

def init_app():
    """Initialize the core application."""
    UPLOAD_FOLDER = 'temp'
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object('config.Config')
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    secrets = dotenv_values(".env")
    app.config['TWILIO_ACCOUNT_SID'] = secrets['TWILIO_ACCOUNT_SID']
    app.config['TWILIO_AUTH_TOKEN'] = secrets['TWILIO_AUTH_TOKEN']
    app.config['SENDGRID_API_KEY'] = secrets['SENDGRID_API_KEY']
    app.config['TWILIO_VERIFY_SERVICE'] = secrets['TWILIO_VERIFY_SERVICE']

    
    app.twilio_client = Client(secrets['TWILIO_ACCOUNT_SID'], secrets['TWILIO_AUTH_TOKEN'])

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
    migrate = Migrate(app, db, render_as_batch=True)
    login_manager.init_app(app)
    
    from .models import User

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    with app.app_context():
        # Include our Routes
        from .auth import routes
        from .connections import routes
        from .users import routes
        from .friends import routes
        from .plates import routes
        db.create_all()
        db.session.commit()
        
        # Register Blueprints
        app.register_blueprint(auth.routes.auth_bp)
        app.register_blueprint(connections.routes.connections_bp)
        app.register_blueprint(users.routes.users_bp)
        app.register_blueprint(friends.routes.friends_bp)
        app.register_blueprint(plates.routes.plates_bp)


        return app