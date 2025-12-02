import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:credit_risk_pass@localhost:5433/credit_risk_db")
engine = create_engine(DATABASE_URL)

def run_migration():
    print("--- 🔄 Starting Database Migration ---")
    with engine.connect() as connection:
        # 1. Add user_id column
        try:
            print("Adding user_id column...")
            connection.execute(text("ALTER TABLE loan_applications ADD COLUMN user_id INTEGER"))
            print("✅ Added user_id column.")
        except Exception as e:
            print(f"⚠️ Could not add user_id (might already exist): {e}")

        # 2. Add risk_factors column (JSON stored as String/Text for simplicity in SQLite/Postgres compatibility)
        try:
            print("Adding risk_factors column...")
            # Using TEXT to store JSON string
            connection.execute(text("ALTER TABLE loan_applications ADD COLUMN risk_factors TEXT"))
            print("✅ Added risk_factors column.")
        except Exception as e:
            print(f"⚠️ Could not add risk_factors (might already exist): {e}")
            
        connection.commit()
    print("--- 🎉 Migration Complete ---")

if __name__ == "__main__":
    run_migration()
