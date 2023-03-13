import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    DEVELOPMENT = True
    SECRET_KEY = 'REPLACE_ME_LATER'
    FLASK_HTPASSWD_PATH = '/secret/.htpasswd'
    FLASK_SECRET = SECRET_KEY
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(basedir, "project.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = os.path.join(basedir, 'temp')
