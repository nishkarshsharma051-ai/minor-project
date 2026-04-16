from .student_model import db
from datetime import datetime

class UserProfile(db.Model):
    __tablename__ = 'user_profiles'

    id = db.Column(db.Integer, primary_key=True)
    firebase_uid = db.Column(db.String(128), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(100))
    role = db.Column(db.String(100), default="User")
    department = db.Column(db.String(100))
    institution = db.Column(db.String(100), default="EduSetu Academy")
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "uid": self.firebase_uid,
            "email": self.email,
            "name": self.name,
            "role": self.role,
            "department": self.department,
            "institution": self.institution,
            "joined": self.joined_at.strftime("%b %Y")
        }
