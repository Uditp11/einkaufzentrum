from flask import Flask
from flask_cors import CORS
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)

from models import db  # import db after app is created

db.init_app(app)  # initialize db with app

from routes import item_bp  # import blueprints after db initialized

app.register_blueprint(item_bp)

@app.route("/")
def hello():
    return "Backend is running"

if __name__ == "__main__":
    with app.app_context():
        db.create_all() 
    app.run(host="0.0.0.0", port=5000)
