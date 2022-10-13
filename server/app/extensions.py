#should hold global variables to stop cyclical imports
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()