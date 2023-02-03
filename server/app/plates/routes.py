from flask import Blueprint, request, render_template, make_response, abort, make_response
from flask import current_app as app
import os

plates_bp = Blueprint('plates_bp', __name__)


@plates_bp.route('/plates/upload', methods=['POST'])
def upload_pic():
    pic = request.files['pic']
    picname = request.files['picname']
    pic.save(os.path.join(app.config['UPLOAD_FOLDER'], picname))

