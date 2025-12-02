from sqlalchemy import create_engine, inspect
import os
from dotenv import load_dotenv
import sys

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

def verify_schema():
    try:
        engine = create_engine(DATABASE_URL)
        inspector = inspect(engine)
        
        columns = inspector.get_columns('loan_applications')
        column_names = [col['name'] for col in columns]
        
        print(f"Columns in 'loan_applications': {column_names}")
        
        missing = []
        if 'user_id' not in column_names:
            missing.append('user_id')
        if 'risk_factors' not in column_names:
            missing.append('risk_factors')
            
        if missing:
            print(f"❌ Missing columns: {missing}")
            sys.exit(1)
        else:
            print("✅ All required columns (user_id, risk_factors) are present!")
            sys.exit(0)
            
    except Exception as e:
        print(f"❌ Error connecting to database: {e}")
        sys.exit(1)

if __name__ == "__main__":
    verify_schema()
