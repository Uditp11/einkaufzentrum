from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .item import Item
from .category import Category
from .user import User  # Add if you have user.py