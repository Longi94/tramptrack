from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)


@app.route('/api/products/availabilities/widget', methods=['GET'])
def proxy_request():
    target_url = 'https://api.roller.app/api/products/availabilities/widget'  # Replace with the URL you want to proxy to

    # Forward the request to the target URL
    response = requests.request(
        'GET',
        target_url,
        headers={
            'X-Api-Key': request.headers['X-Api-Key']
        },
        params=request.args
    )

    return jsonify(response.json()), response.status_code

if __name__ == '__main__':
    app.run(port=8080, host='0.0.0.0')
