import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

# 1. The Connection String
# Syntax: postgresql://<username>:<password>@<ip-address>/<dbname>
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:credit_risk_pass@localhost:5433/credit_risk_db")

# 2. The Engine
# This is the actual connection point.
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# 3. The SessionLocal
# Each time a user requests data, we create a "Session".
# Think of it like a temporary workspace for that specific request.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. The Base Class
# All our database tables (Models) will inherit from this class.
Base = declarative_base()

# 5. Dependency
# This is a helper function we will use in our API to get a connection
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() # Always close the connection when done!