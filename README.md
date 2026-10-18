# Einkaufzentrum: University Student Marketplace

**Einkaufzentrum** is a full-stack peer-to-peer marketplace where university students can buy, sell and exchange items. It has a Flask and SQLAlchemy API with JWT login and an admin role, a React (Vite) frontend, and an admin dashboard for moderating listings and users. It also includes a demo image check: a small Fashion-MNIST classifier whose classes 8 and 9 (bags and ankle boots) are treated as spam, so a listing with such an image gets flagged for the admin.

This repository is developed and maintained by Udit Parihar.

---

## Key Features

### 1. Student Portal (Buyer and Seller Flow)
- **User Authentication**: Signup and login with JWT tokens.
- **Product Exploration**: Search and explore pages with item categories and simple synonym matching (for example, searching "bike" also finds the "Bikes" category).
- **Abuse Reporting**: Users can report scam listings or abusive accounts from the product views.
- **Purchase Requests**: A logged-in student can send a purchase request with a payment choice (offline cash handover or online bank transfer). The item is marked as sold and a message is saved to the seller's inbox.

### 2. Demo Image Moderation
- **CNN Classifier**: A small convolutional network built with TensorFlow/Keras and trained on the Fashion-MNIST dataset.
- **Spam Rule**: Fashion-MNIST classes `0-7` count as appropriate. Classes `8-9` (bags, ankle boots) count as spam. This is a stand-in for real moderation, not a spam detector.
- **How it runs**: When a listing is created, the backend converts its image to 28x28 grayscale and runs the model in a subprocess. This only happens when the machine learning virtual environment exists at `machine_learning/venv` (the path is the Windows layout, `venv\Scripts\python.exe`). Otherwise the check is skipped.
- **Flags**: A flagged listing gets a report with the reason `[AI Moderate Flag]` and its score, so it appears in the admin's reported posts queue.

### 3. Administrator Dashboard
- **Counters**: Pending items, reported users and reported posts.
- **Listing Approval Queue**: Every new listing starts as pending. Admins can view the details and approve or reject it.
- **Reported Posts**: Lists reported ads with the reporter and reason. The admin can delete the listing or dismiss the reports.
- **User Moderation**: View reported profiles, ban or delete accounts. Banning a user also hides their listings.

---

## Technology Stack

| Component | Technology | Description |
|-----------|------------|-------------|
| **Frontend** | React, React Router, Axios, Bootstrap, AOS | Single-page application with modals and a responsive grid |
| **Backend** | Python Flask, Flask-CORS, PyJWT, SQLAlchemy | REST API with token checks on protected routes |
| **Database** | SQLite / MySQL | SQLite file `einkaufzentrum.db` by default, or any database URL set in `DATABASE_URL` |
| **Machine Learning** | TensorFlow 2.x, Keras, NumPy, PIL | Image preprocessing and CNN inference in a subprocess |

---

## Project Structure

```text
einkaufzentrum/
├── backend/                       # Flask REST API
│   ├── models/                    # Database models (Item, User, Report, Message, Category)
│   ├── routes/                    # Blueprint routes (admin, items, users, upload)
│   ├── config.py                  # Configuration and SQLite fallback
│   ├── seed_db.py                 # Creates the tables and loads sample data
│   └── app.py                     # Backend entry point
│
├── frontend/                      # React single-page app
│   ├── src/Components/            # UI components (Dashboard, ProductCard, admin pages)
│   ├── src/Style/                 # CSS styles
│   ├── src/App.jsx                # Frontend routes and layout
│   └── .env.example               # Backend URL for the frontend
│
└── machine_learning/              # Demo image classifier
    ├── spam_detection_model.py    # Training script
    ├── classify_image.py          # Script the backend calls for a prediction
    └── spam_detection_model.keras # Trained model
```

---

## Getting Started

### 1. Prerequisites
- Python 3.10+
- Node.js (v18+)

The commands below use Windows paths (`venv\Scripts\...`).

### 2. Backend and ML Environment Setup
From the repository root, go to the `backend` folder, create a virtual environment and install the dependencies:
```bash
cd einkaufzentrum/backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Then set up the `machine_learning` folder with its own virtual environment, which keeps TensorFlow separate:
```bash
cd ../machine_learning
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Initialize and Seed the Database
Reset the local database and load sample categories, student accounts and reported posts:
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

In a new terminal, go to the `frontend` folder, copy the example env file, install the npm dependencies and start the development server (runs on `http://localhost:3001`):
```bash
cd einkaufzentrum/frontend
copy .env.example .env
npm install
npm run dev
```

---

## Default Test Credentials
These accounts are created by `seed_db.py`:
- **Administrator**: `admin@hs-fulda.de` / `AdminPass123!`
- **Student User**: `lillian@hs-fulda.de` / `Password123!`
