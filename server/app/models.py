from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import select
from flask_login import UserMixin
from flask import current_app as app
from .extensions import db
 
friendship = db.Table('friendship',
                       db.Column('user1_id', db.Integer, db.ForeignKey('user.id')),
                       db.Column('user2_id', db.Integer, db.ForeignKey('user.id')))

friend_request = db.Table('friend_request',
                       db.Column('sender_id', db.Integer, db.ForeignKey('user.id')),
                       db.Column('recipient_id', db.Integer, db.ForeignKey('user.id')))

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    plate = db.Column(db.String(10), unique=True, nullable=False, server_default="ABC123")
    username = db.Column(db.String(80), unique=False, nullable=False)
    password = db.Column(db.String(100))
    email = db.Column(db.String(120), unique=True, nullable=False)
    created = db.Column(db.DateTime, index=False, unique=False, nullable=False)
    bio = db.Column(db.Text, index=False, unique=False, nullable=True)
    admin = db.Column( db.Boolean, index=False, unique=False, nullable=False)
    connections = db.relationship('Connection', backref='user', lazy=True)

    #friend_requests_sent = db.relationship('User', backref='sender', lazy=True)
    #friend_requests_recieved = db.relationship('User', secondary=friend_request, primaryjoin=(id==friend_request.c.sender_id))
    friends = db.relationship('User', secondary=friendship, primaryjoin=(id==friendship.c.user1_id), secondaryjoin=(id==friendship.c.user2_id))
   
    def __repr__(self):
        return '<User %r>' % self.plate
 
class Connection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    app_name = db.Column(db.String(80), unique=False, nullable=False)
    link = db.Column(db.Text, index=False, unique=False, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return '<Connection %r>' % self.link