class Config:
    SQLALCHEMY_DATABASE_URI = (
        "mysql+pymysql://admin:Gdsdteam4_123"
        "@team4-db.ck1s0emywc4t.us-east-1.rds.amazonaws.com:3306"
        "/team4appdb_test"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
