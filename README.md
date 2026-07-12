# 🛍️ Einkaufzentrum - University Student Marketplace & AI Moderator

**Einkaufzentrum** is a modern, responsive full-stack peer-to-peer marketplace designed specifically for university students to buy, sell, and exchange essentials. It features an integrated **Machine Learning image classifier** that automatically moderates uploads to prevent spam, paired with a robust **Admin Dashboard** for community control.

This repository is developed and maintained by Udit Parihar.

---

## 🚀 Key Features

### 1. Student Portal (Buyer & Seller Flow)
- **User Authentication**: Secure signup and login with JWT token authentication.
- **Product Exploration**: Interactive search and explore interface, including item category grouping and synonym matching (e.g., search "bike" for the "Bikes" category).
- **Abuse Reporting**: Users can report scam listings or abusive accounts directly from product views.
- **Secure Purchases**: Logged-in students can request coordinates for meetup coordination, support online bank transfers or offline cash handshakes, and log automatically created message alerts to the seller's inbox.

### 2. Machine Learning Image Moderation
- **CNN Classifier**: Convolutional Neural Network (CNN) model built using TensorFlow/Keras, trained on the Fashion MNIST dataset.
- **Automated Spam Detection**: Every newly created listing has its image preprocessed (converted to 28x28 grayscale) and run through the model in a subprocess.
- **Rule Mapping**: Images matching Fashion MNIST classes `0-7` (clean apparel/shoes) are automatically marked safe, while classes `8-9` (bags, ankle boots) trigger the spam detection rule.
- **AI Moderator Flags**: Flagged items are automatically labeled with `[AI Moderate Flag]`, put on hold, and added to the admin review queue.

### 3. Administrator Dashboard
- **Real-Time Analytics**: Visual counters tracking pending items, reported users, and flagged scam posts.
- **Listing Approval Queue**: Admins can examine detailed information for pending ads and approve or reject/delete them.
- **Scam Queue Management**: Lists all reported ads with details of the reporter, reason, and classification score, allowing the admin to delete listings or dismiss reports.
- **User Moderation**: View reported profiles, deactivate/ban accounts, and automatically purge listings from banned users.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
|-----------|------------|-------------|
| **Frontend** | React, React Router, Axios, Bootstrap, AOS | Single-page application, interactive modals, responsive grid |
| **Backend** | Python Flask, Flask-CORS, PyJWT, SQLAlchemy | RESTful APIs, token authorization guards |
| **Database** | SQLite / MySQL | Local database fallback (`einkaufzentrum.db`) with dynamic deploy support |
| **Machine Learning**| TensorFlow 2.x, Keras, NumPy, PIL | Image preprocessing, CNN inference via subprocess |

---

## 📂 Project Structure

```text
├── backend/                   # Flask REST API
│   ├── models/                # Database schemas (Item, User, Report, Message)
│   ├── routes/                # Blueprint routes (admin, items, users)
│   ├── config.py              # Configuration & fallback database setups
│   ├── seed_db.py             # Automatic table initialization & mock seeder
│   └── app.py                 # Backend entry point
│
├── frontend/                  # React Single Page App
│   ├── src/Components/        # UI components (Dashboard, ProductCard, Admin Moderation)
│   ├── src/Style/             # Vanilla CSS layout styles
│   └── src/App.jsx            # Frontend routes & layout container
│
└── machine_learning/          # AI pipeline
    ├── fashion_mnist_dataset/ # Dataset files for testing
    ├── classify_image.py      # Subprocess bridge script for model prediction
    └── spam_detection_model.keras # Pre-trained CNN model
```

---

## 💻 Getting Started

### 1. Prerequisites
- Python 3.10+
- Node.js (v18+)

### 2. Backend & ML Environment Setup
Navigate to the `backend` folder, set up your Python virtual environment, and install dependencies:
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Navigate to the `machine_learning` folder, set up its dedicated virtual environment (for TensorFlow/Keras isolation), and install dependencies:
```bash
cd ../machine_learning
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Initialize & Seed Database
Reset your local database and load mock categories, active student accounts, and reported posts:
```bash
cd ../backend
venv\Scripts\python seed_db.py
```
*Note: This creates a local SQLite database file `einkaufzentrum.db`.*

### 4. Start the Application
Start the backend server (runs on `http://localhost:5000`):
```bash
venv\Scripts\python app.py
```

Open a new terminal window, navigate to the `frontend` folder, install npm dependencies, and start the development server (runs on `http://localhost:3001`):
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Default Test Credentials
- **Administrator**: `admin@hs-fulda.de` / `AdminPass123!`
- **Student User**: `lillian@hs-fulda.de` / `Password123!`