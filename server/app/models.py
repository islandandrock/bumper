from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from flask import current_app as app
from . import db

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(100))
    email = db.Column(db.String(120), unique=True, nullable=False)
    created = db.Column(db.DateTime, index=False, unique=False, nullable=False)
    bio = db.Column(db.Text, index=False, unique=False, nullable=True)
    admin = db.Column( db.Boolean, index=False, unique=False, nullable=False)
    
    def __repr__(self):
        return '<User %r>' % self.username