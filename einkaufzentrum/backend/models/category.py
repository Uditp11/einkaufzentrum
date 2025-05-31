from extensions import db

class Category(db.Model):
    __tablename__ = 'Categories'

    category_id = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)