import tensorflow as tf
import numpy as np
import keras
from keras import layers, models
import os
import matplotlib.pyplot as plt

# Load Fashion MNIST dataset
def load_fashion_mnist():
    (train_images, train_labels), (test_images, test_labels) = keras.datasets.fashion_mnist.load_data()
    
    # Normalize pixel values to be between 0 and 1
    train_images = train_images.astype('float32') / 255.0
    test_images = test_images.astype('float32') / 255.0
    
    # Reshape images to include channel dimension
    train_images = train_images.reshape((60000, 28, 28, 1))
    test_images = test_images.reshape((10000, 28, 28, 1))
    
    # Convert labels to binary classification (0-7: appropriate, 8-9: inappropriate)
    train_labels = np.where(train_labels >= 8, 1, 0)
    test_labels = np.where(test_labels >= 8, 1, 0)
    
    return (train_images, train_labels), (test_images, test_labels)

# Create and compile the model
def create_model():
    model = models.Sequential([
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.Flatten(),
        layers.Dense(64, activation='relu'),
        layers.Dense(1, activation='sigmoid')
    ])
    
    model.compile(optimizer='adam',
                 loss='binary_crossentropy',
                 metrics=['accuracy'])
    
    return model

# Train the model
def train_model(model, train_images, train_labels, test_images, test_labels):
    history = model.fit(train_images, train_labels, epochs=10,
                       validation_data=(test_images, test_labels))
    return history

# Save the model
def save_model(model, model_path):
    model.save(model_path + '.keras')

# Load the model
def load_saved_model(model_path):
    return keras.models.load_model(model_path)

# Predict on a single image
def predict_image(model, image):
    # Ensure image is in the correct format
    if len(image.shape) == 2:
        image = image.reshape(1, 28, 28, 1)
    elif len(image.shape) == 3:
        image = image.reshape(1, 28, 28, 1)
    
    # Normalize pixel values
    image = image.astype('float32') / 255.0
    
    # Make prediction
    prediction = model.predict(image)
    return prediction[0][0]  # Return probability of being inappropriate

# Plot training history
def plot_training_history(history):
    plt.figure(figsize=(12, 4))
    
    plt.subplot(1, 2, 1)
    plt.plot(history.history['accuracy'], label='Training Accuracy')
    plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
    plt.title('Model Accuracy')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend()
    
    plt.subplot(1, 2, 2)
    plt.plot(history.history['loss'], label='Training Loss')
    plt.plot(history.history['val_loss'], label='Validation Loss')
    plt.title('Model Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    
    plt.tight_layout()
    plt.savefig('training_history.png')
    plt.close()

def main():
    # Load dataset
    print("Loading Fashion MNIST dataset...")
    (train_images, train_labels), (test_images, test_labels) = load_fashion_mnist()
    
    # Create and compile model
    print("Creating model...")
    model = create_model()
    
    # Train model
    print("Training model...")
    history = train_model(model, train_images, train_labels, test_images, test_labels)
    
    # Plot training history
    plot_training_history(history)
    print("Training history plot saved as 'training_history.png'")
    
    # Save model
    model_path = os.path.join(os.path.dirname(__file__), 'spam_detection_model')
    print(f"Saving model to {model_path}...")
    save_model(model, model_path)
    
    # Evaluate model
    test_loss, test_acc = model.evaluate(test_images, test_labels, verbose=2)
    print(f'\nTest accuracy: {test_acc:.4f}')
    print(f'Test loss: {test_loss:.4f}')
    
    # Test with sample images
    print("\nTesting with sample images:")
    sample_indices = np.random.choice(len(test_images), 5, replace=False)
    plt.figure(figsize=(15, 3))
    
    for i, idx in enumerate(sample_indices):
        plt.subplot(1, 5, i + 1)
        plt.imshow(test_images[idx].reshape(28, 28), cmap='gray')
        prediction = predict_image(model, test_images[idx])
        actual = test_labels[idx]
        plt.title(f'Pred: {prediction:.2f}\nActual: {actual}')
        plt.axis('off')
    
    plt.tight_layout()
    plt.savefig('sample_predictions.png')
    plt.close()
    print("Sample predictions plot saved as 'sample_predictions.png'")

if __name__ == "__main__":
    main() 