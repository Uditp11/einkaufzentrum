import os
import sys
import json
import numpy as np
from PIL import Image
import requests
from io import BytesIO

# Suppress TensorFlow logging to keep stdout clean
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import tensorflow as tf
from tensorflow import keras

def load_image(source):
    """Load image from local path or URL and convert to PIL Image."""
    if source.startswith('http://') or source.startswith('https://'):
        response = requests.get(source, timeout=10)
        return Image.open(BytesIO(response.content))
    else:
        return Image.open(source)

def preprocess_image(pil_img):
    """Convert to 28x28 grayscale and normalize to match Fashion MNIST."""
    # Convert to grayscale
    gray_img = pil_img.convert('L')
    
    # Resize to 28x28
    resized_img = gray_img.resize((28, 28))
    
    # Convert to numpy array and scale to [0, 1]
    img_array = np.array(resized_img, dtype=np.float32) / 255.0
    
    # Add batch and channel dimensions (1, 28, 28, 1)
    img_array = np.expand_dims(img_array, axis=(0, -1))
    
    return img_array

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image source provided"}))
        sys.exit(1)
        
    image_source = sys.argv[1]
    
    try:
        # Load and preprocess
        pil_img = load_image(image_source)
        img_array = preprocess_image(pil_img)
        
        # Load the Keras model relative to the script directory
        model_path = os.path.join(os.path.dirname(__file__), 'spam_detection_model.keras')
        if not os.path.exists(model_path):
            # Try loading without .keras extension if it fails
            model_path_alt = os.path.join(os.path.dirname(__file__), 'spam_detection_model')
            model = keras.models.load_model(model_path_alt)
        else:
            model = keras.models.load_model(model_path)
            
        # Predict
        prediction = model.predict(img_array, verbose=0)
        score = float(prediction[0][0])
        
        # Determine classification
        # Classes >= 8 (Bag, Ankle Boot) are considered inappropriate / spam
        is_spam = score > 0.5
        
        result = {
            "success": True,
            "score": score,
            "is_spam": is_spam,
            "label": "Inappropriate" if is_spam else "Appropriate"
        }
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": str(e)
        }))
        sys.exit(1)

if __name__ == "__main__":
    main()
