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
    TWILIO_ACCOUNT_SID="AC3c0aa0a0647a6cac3b1f29e93a371a1d"
    TWILIO_AUTH_TOKEN="ef199bf17c6a8f1cd78f029f0da54dbd"
    TWILIO_VERIFY_SERVICE="VA979c077fbaddd479b4b0f502b5467c0b"
    SENDGRID_API_KEY="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"
