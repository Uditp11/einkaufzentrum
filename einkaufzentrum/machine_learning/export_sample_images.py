"""Writes the first Fashion-MNIST test image of each label to
fashion_mnist_dataset/fashion_mnist/<label>-<index>.png for test_ml_pipeline.py.
Run it with the machine learning venv's python. Keras downloads the dataset on first use."""
import os
import keras
from PIL import Image

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fashion_mnist_dataset", "fashion_mnist")

def main():
    _, (test_images, test_labels) = keras.datasets.fashion_mnist.load_data()
    os.makedirs(OUT_DIR, exist_ok=True)
    for label in range(10):
        index = int((test_labels == label).argmax())
        Image.fromarray(test_images[index]).save(os.path.join(OUT_DIR, f"{label}-{index}.png"))
    print(f"Wrote 10 images to {OUT_DIR}")

if __name__ == "__main__":
    main()
