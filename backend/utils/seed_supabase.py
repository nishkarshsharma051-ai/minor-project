import os
import sys
import pandas as pd
import random
import psycopg2

app_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(app_dir)

from app import create_app
from models.student_model import db, Student
from dotenv import load_dotenv

load_dotenv()

FIRST_NAMES = ["Arjun", "Riya", "Aarav", "Isha", "Vikram", "Neha", "Aditya", "Kavya", "Rohan", "Ananya", "Karan", "Pooja", "Rahul", "Priya", "Vivek", "Sneha", "Nikhil", "Divya", "Siddharth", "Shruti"]
LAST_NAMES = ["Sharma", "Patel", "Kumar", "Singh", "Das", "Verma", "Gupta", "Rao", "Jain", "Mehta", "Bose", "Dutta", "Nair", "Iyer", "Chopra", "Chauhan", "Yadav", "Reddy", "Menon", "Joshi"]

def seed():
    if not os.environ.get("DATABASE_URL") or "[your-project-id]" in os.environ.get("DATABASE_URL"):
        print("Error: Please specify a valid Supabase DATABASE_URL in backend/backend/.env")
        return

    app = create_app()
    with app.app_context():
        # 1. Create table schema
        print("Creating table schema in Supabase...")
        db.create_all()

        # 2. Check if we already have records to avoid duplicate inserts
        if Student.query.count() > 0:
            print(f"Skipping seed: Database already contains {Student.query.count()} students.")
            return

        # 3. Read dataset
        csv_path = os.path.join(app_dir, "data", "students.csv")
        if not os.path.exists(csv_path):
            print(f"Error: Could not find {csv_path}")
            return
            
        print("Reading students.csv...")
        df = pd.read_csv(csv_path)

        def generate_student(idx, row):
            random.seed(idx)
            first_name = random.choice(FIRST_NAMES)
            last_name = random.choice(LAST_NAMES)
            
            assignment = float(row.get("assignment_completion", 0))
            study_hours = round(max(2.0, min(12.0, (assignment / 10.0) + random.uniform(-1, 1))), 1)
            
            return Student(
                first_name=first_name,
                last_name=last_name,
                initials=f"{first_name[0]}{last_name[0]}",
                marks=float(row.get("marks", 0)),
                attendance=float(row.get("attendance", 0)),
                assignment_completion=float(row.get("assignment_completion", 0)),
                study_hours=study_hours,
                participation=float(row.get("participation", 0)),
                coding_score=float(row.get("coding_score", 0)),
                communication_score=float(row.get("communication_score", 0)),
                attendance_risk=float(row.get("attendance", 0)) < 75.0,
                dropout_risk=row.get("dropout_risk", "low")
            )


        print(f"Building {len(df)} database records locally...")
        students_to_insert = []
        for idx, row in df.iterrows():
            students_to_insert.append(generate_student(idx, row))

        # Do a bulk insert for high performance over the wire
        print("Uploading data to Supabase...")
        try:
            db.session.bulk_save_objects(students_to_insert)
            db.session.commit()
            print("Successfully seeded all records!")
        except Exception as e:
            db.session.rollback()
            print(f"Failed to seed data: {str(e)}")

if __name__ == "__main__":
    seed()
