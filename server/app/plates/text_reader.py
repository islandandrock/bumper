import easyocr
import cv2
import numpy as np
from detect import detect

img = '7.jpg'



import requests
from pprint import pprint
regions = ['us'] # Change to your country
with open(img, 'rb') as fp:
    response = requests.post(
        'https://api.platerecognizer.com/v1/plate-reader/',
        data=dict(regions=regions),  # Optional
        files=dict(upload=fp),
        headers={'Authorization': 'Token 2eabc8718a3cf43303e8dfe7d1e5fb9194dfd335'})
pprint(response.json())

# Calling with a custom engine configuration
import json
with open(img, 'rb') as fp:
    response = requests.post(
        'https://api.platerecognizer.com/v1/plate-reader/',
        data=dict(regions=['us'], config=json.dumps(dict(region="strict"))),  # Optional
        files=dict(upload=fp),
        headers={'Authorization': 'Token 2eabc8718a3cf43303e8dfe7d1e5fb9194dfd335'})