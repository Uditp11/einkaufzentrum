from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db
from routes import register_routes

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, supports_credentials=True)
db.init_app(app)

register_routes(app)

@app.route("/")
def health():
    return "Backend is running successfully!"

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000)