import os
from datetime import timedelta

class Config:
    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "sqlite:///" + os.path.join(os.path.abspath(os.path.dirname(__file__)), "einkaufzentrum.db")
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-super-secret-key-change-in-production'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)
    
    # CORS configuration
    CORS_HEADERS = 'Content-Type'

    AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID", "YOUR_AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY", "YOUR_AWS_SECRET_ACCESS_KEY")
    S3_BUCKET = os.environ.get("S3_BUCKET", "einkaufzentrum-s3-bucket")
    S3_REGION = os.environ.get("S3_REGION", "us-east-1")

    # Image uploads go to S3 only when AWS keys are set, otherwise to this folder
    USE_S3 = bool(os.environ.get("AWS_ACCESS_KEY_ID") and os.environ.get("AWS_SECRET_ACCESS_KEY"))
    UPLOAD_FOLDER = os.path.join(os.path.abspath(os.path.dirname(__file__)), "uploads")