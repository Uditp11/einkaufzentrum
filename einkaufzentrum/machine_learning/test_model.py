import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
from spam_detection_model import load_fashion_mnist, load_saved_model

def test_random_samples(model, test_images, test_labels, num_samples=5):
    print("Selecting random samples...")
    # Get random indices
    indices = np.random.randint(0, len(test_images), num_samples)
    
    # Create a figure for visualization
    plt.figure(figsize=(15, 3))
    
    for i, idx in enumerate(indices):
        print(f"Processing sample {i+1}/{num_samples}...")
        # Get image and true label
        image = test_images[idx]
        true_label = test_labels[idx]
        
        # Make prediction
        pred = model.predict(image.reshape(1, 28, 28, 1), verbose=0)[0][0]
        
        # Create subplot
        plt.subplot(1, num_samples, i + 1)
        plt.imshow(image.reshape(28, 28), cmap='gray')
        
        # Set title with prediction and true label
        title = f'Pred: {"Inappropriate" if pred > 0.5 else "Appropriate"}\n'
        title += f'True: {"Inappropriate" if true_label == 1 else "Appropriate"}\n'
        title += f'Confidence: {pred:.2f}'
        plt.title(title)
        plt.axis('off')
    
    plt.tight_layout()
    plt.show()

def main():
    try:
        # Load the trained model
        print("Loading trained model...")
        model = load_saved_model('spam_detection_model.keras')
        
        # Load test data
        print("Loading test data...")
        _, (test_images, test_labels) = load_fashion_mnist()
        
        # Test random samples
        print("\nTesting model on random samples...")
        test_random_samples(model, test_images, test_labels, num_samples=5)
        
        # Test specifically on inappropriate samples (classes 8-9)
        print("\nTesting model on inappropriate samples (classes 8-9)...")
        inappropriate_indices = np.where(test_labels == 1)[0]
        if len(inappropriate_indices) > 0:
            test_random_samples(model, test_images[inappropriate_indices], 
                              test_labels[inappropriate_indices], num_samples=5)
    
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main() 