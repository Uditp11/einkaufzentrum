from .item_routes import item_bp
from .user_routes import user_bp

def register_routes(app):
    app.register_blueprint(item_bp)
    app.register_blueprint(user_bp)