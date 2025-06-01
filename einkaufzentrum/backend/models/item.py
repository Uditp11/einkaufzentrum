from extensions import db

from datetime import datetime

class Item(db.Model):
    __tablename__ = 'Items'

    item_id     = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title       = db.Column(db.String(100))
    description = db.Column(db.Text)
    price       = db.Column(db.Float)
    category_id = db.Column(db.Integer, db.ForeignKey('Categories.category_id'))
    seller_id   = db.Column(db.Integer)
    media_url   = db.Column(db.String(2083))
    date_posted = db.Column(db.DateTime, default=datetime.utcnow)
    status      = db.Column(db.Enum('Pending', 'Approved', 'Sold', 'Deleted'))

    category = db.relationship('Category', backref='items')

    def to_dict(self):
        return {
            "item_id": self.item_id,
            "title": self.title,
            "description": self.description,
            "price": self.price,
            "category_id": self.category_id,
            "category_name": self.category.name if self.category else None,
            "seller_id": self.seller_id,
            "media_url": self.media_url,
            "date_posted": self.date_posted.isoformat() if self.date_posted else None,
            "status": self.status
        }