from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Student(db.Model):
    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    initials = db.Column(db.String(5), nullable=False)
    
    # Metrics
    marks = db.Column(db.Float, default=0.0)
    attendance = db.Column(db.Float, default=0.0)
    assignment_completion = db.Column(db.Float, default=0.0)
    study_hours = db.Column(db.Float, default=0.0)
    
    # Enums / Labels
    attendance_risk = db.Column(db.Boolean, default=False)
    dropout_risk = db.Column(db.String(20), default="low")

    @property
    def display_name(self):
        return f"{self.first_name} {self.last_name}"

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.display_name,
            "initials": self.initials,
            "attendance": round(float(self.attendance), 1) if self.attendance is not None else 0.0,
            "marks": round(float(self.marks), 1) if self.marks is not None else 0.0,
            "studyHours": round(float(self.study_hours), 1) if self.study_hours is not None else 0.0,
            "attendanceRisk": self.attendance_risk,
            "dropoutRisk": self.dropout_risk
        }
