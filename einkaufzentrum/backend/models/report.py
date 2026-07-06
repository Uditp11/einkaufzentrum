from extensions import db
from datetime import datetime

class Report(db.Model):
    __tablename__ = 'Reports'
    report_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    reporter_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'))
    target_item_id = db.Column(db.Integer, db.ForeignKey('Items.item_id'), nullable=True)
    target_user_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'), nullable=True)
    reason = db.Column(db.Text, nullable=False)
    status = db.Column(db.Enum('Pending', 'Reviewed', 'Resolved'), default='Pending')
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    reporter = db.relationship('User', foreign_keys=[reporter_id], backref='reports_submitted')
    target_user = db.relationship('User', foreign_keys=[target_user_id], backref='reports_received')
    target_item = db.relationship('Item', backref='reports')

    def to_dict(self):
        return {
            "report_id": self.report_id,
            "reporter_id": self.reporter_id,
            "reporter_name": self.reporter.full_name if self.reporter else "Unknown",
            "target_item_id": self.target_item_id,
            "target_item_title": self.target_item.title if self.target_item else None,
            "target_user_id": self.target_user_id,
            "target_user_name": self.target_user.full_name if self.target_user else None,
            "reason": self.reason,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None
        }
