from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np

from model_loader import predict_action
from caption_utils import generate_caption

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Action Recognition API Running"})

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files["image"]
    image_bytes = np.frombuffer(file.read(), np.uint8)
    image = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)

    action = predict_action(image)
    caption = generate_caption(action)

    return jsonify({
        "action": action,
        "caption": caption
    })

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
