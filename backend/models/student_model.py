from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Student(db.Model):
    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    initials = db.Column(db.String(5), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Metrics
    marks                 = db.Column(db.Float, default=0.0)
    attendance            = db.Column(db.Float, default=0.0)
    assignment_completion = db.Column(db.Float, default=0.0)
    study_hours           = db.Column(db.Float, default=0.0)
    participation         = db.Column(db.Float, default=0.0)
    coding_score          = db.Column(db.Float, default=0.0)
    communication_score   = db.Column(db.Float, default=0.0)
    
    # Enums / Labels
    attendance_risk = db.Column(db.Boolean, default=False)
    dropout_risk = db.Column(db.String(20), default="low")

    @property
    def display_name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def dynamic_cgpa(self):
        # Default calculation: Marks / 10
        return round(float(self.marks or 0) / 10.0, 2)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.display_name,
            "initials": self.initials,
            "attendance": round(float(self.attendance or 0), 1),
            "marks": round(float(self.marks or 0), 1),
            "cgpa": self.dynamic_cgpa,
            "studyHours": round(float(self.study_hours or 0), 1),
            "assignment_completion": round(float(self.assignment_completion or 0), 1),
            "participation": round(float(self.participation or 0), 1),
            "coding_score": round(float(self.coding_score or 0), 1),
            "communication_score": round(float(self.communication_score or 0), 1),
            "attendanceRisk": self.attendance_risk,
            "dropoutRisk": self.dropout_risk
        }

