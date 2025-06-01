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
