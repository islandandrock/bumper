from flask import Blueprint, request, render_template, make_response, abort, make_response
from flask import current_app as app
import os
from werkzeug.exceptions import BadRequest, UnsupportedMediaType


plates_bp = Blueprint('plates_bp', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpeg', 'jpg'}

import requests
from pprint import pprint

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@plates_bp.route('/plates/upload', methods=['GET', 'POST'])
def upload_pic():
    
    if not "photo" in request.files:
        raise BadRequest('no file uploaded')

    image = request.files['photo']

    if not allowed_file(image.filename):
        raise UnsupportedMediaType('wrong file type')

    image.save(os.path.join(app.config['UPLOAD_FOLDER'], image.filename))
    return "", 200