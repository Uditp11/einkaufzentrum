import os
from datetime import timedelta

class Config:
    # Database configuration
    SQLALCHEMY_DATABASE_URI = (
        "mysql+pymysql://admin:Gdsdteam4_123"
        "@team4-db.ck1s0emywc4t.us-east-1.rds.amazonaws.com:3306"
        "/team4appdb_test"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-super-secret-key-change-in-production'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)
    
    # CORS configuration
    CORS_HEADERS = 'Content-Type'

    AWS_ACCESS_KEY_ID = "AKIAST5TF2TFAC5UNOUX"
    AWS_SECRET_ACCESS_KEY = "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"
    S3_BUCKET = "gdsd-project-summer-2025"
    S3_REGION = "us-east-1"