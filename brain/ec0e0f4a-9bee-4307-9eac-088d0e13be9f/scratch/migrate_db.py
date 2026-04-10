import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()
db_url = os.environ.get("DATABASE_URL")
if not db_url:
    print("Error: DATABASE_URL not found in .env")
    exit(1)

# Fix for potential postgresql:// vs postgres:// issues with some libraries
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

engine = create_engine(db_url)

print("Connecting to database...")
with engine.connect() as conn:
    print("Running migrations...")
    try:
        conn.execute(text("ALTER TABLE students ADD COLUMN IF NOT EXISTS participation FLOAT DEFAULT 0.0;"))
        conn.execute(text("ALTER TABLE students ADD COLUMN IF NOT EXISTS coding_score FLOAT DEFAULT 0.0;"))
        conn.execute(text("ALTER TABLE students ADD COLUMN IF NOT EXISTS communication_score FLOAT DEFAULT 0.0;"))
        conn.commit()
        print("Migration successful.")
    except Exception as e:
        print(f"Migration failed: {e}")
        conn.rollback()
