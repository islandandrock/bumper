import requests

def plate_recognizer(img):
    regions = ['us'] # Change to your country
    with open(img, 'rb') as fp:
        response = requests.post(
            'https://api.platerecognizer.com/v1/plate-reader/',
            data=dict(regions=regions),  # Optional
            files=dict(upload=fp),
            headers={'Authorization': 'Token 2eabc8718a3cf43303e8dfe7d1e5fb9194dfd335'})
    return response.json()
