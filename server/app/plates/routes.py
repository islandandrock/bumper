from flask import Blueprint, request, render_template, make_response, abort, make_response
from flask import current_app as app
import os

plates_bp = Blueprint('plates_bp', __name__)


@plates_bp.route('/plates/upload', methods=['GET', 'POST'])
def upload_pic():

    formData = request.json

    uri = formData.get('_parts')[0][1]['uri']
    name = formData.get('_parts')[0][1]['name']
    print(request.files)
    print(request.form)
    print(request.json)

    uri.save(os.path.join(app.config['UPLOAD_FOLDER'], name))
    return {}
