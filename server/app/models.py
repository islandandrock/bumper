from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import select
from flask_login import UserMixin
from flask import current_app as app
from . import db, login_manager
 
friendship = db.Table('friendship',
                       db.Column('user1_id', db.Integer, db.ForeignKey('user.id')),
                       db.Column('user2_id', db.Integer, db.ForeignKey('user.id')))
 
class User(UserMixin, db.Model):
   id = db.Column(db.Integer, primary_key=True)
   username = db.Column(db.String(80), unique=True, nullable=False)
   password = db.Column(db.String(100))
   email = db.Column(db.String(120), unique=True, nullable=False)
   created = db.Column(db.DateTime, index=False, unique=False, nullable=False)
   bio = db.Column(db.Text, index=False, unique=False, nullable=True)
   admin = db.Column( db.Boolean, index=False, unique=False, nullable=False)
   connections = db.relationship('Connection', backref='user', lazy=True)
  
  
   def __repr__(self):
       return '<User %r>' % self.username
 
friendship_union = select([
                       friendship.c.user1_id,
                       friendship.c.user2_id
                       ]).union(
                           select([
                               friendship.c.user2_id,
                               friendship.c.user1_id]
                           )
                   ).alias()
 
User.friends = friends = db.relationship('User', secondary=friendship_union, primaryjoin=id==friendship.c.user1_id, secondaryjoin=id==friendship.c.user2_id)
 
class Connection(db.Model):
   id = db.Column(db.Integer, primary_key=True)
   app_name = db.Column(db.String(80), unique=True, nullable=False)
   link = db.Column(db.Text, index=False, unique=False, nullable=False)
   user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
 
   def __repr__(self):
       return '<Connection %r>' % self.link
 
db.create_all()
u1, u2, u3, u4, u5 = User(name='u1'), User(name='u2'), \
                   User(name='u3'), User(name='u4'), User(name='u5')
 
u1.friends = [u2, u3]
u4.friends = [u2, u5]
u3.friends.append(u5)
db.session.add_all([u1, u2, u3, u4, u5])
db.session.commit()
 
print(u2.friends)
print(u5.friends)
