from .item_routes import item_bp
from .user_routes import user_bp
from .upload_routes import upload_bp
from .admin_routes import admin_bp

def register_routes(app):
    app.register_blueprint(item_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(upload_bp)
    app.register_blueprint(admin_bp)