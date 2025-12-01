# app/models.py
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.sql import func
from .database import Base

# app/models.py
# ... (imports stay the same)

class LoanApplication(Base):
    __tablename__ = "loan_applications"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    income = Column(Float)
    loan_amount = Column(Float)
    credit_score = Column(Integer)
    
    # --- NEW COLUMNS ---
    age = Column(Integer)
    years_employed = Column(Integer)
    gender = Column(String)
    # -------------------

    status = Column(String, default="PENDING") 
    risk_score = Column(Float, default=0.0) # Let's store the AI score too!
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class RiskAnalysisHistory(Base):
    __tablename__ = "risk_analysis_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True) # ForeignKey would be better, but keeping it simple for now
    filename = Column(String)
    result = Column(String) # We'll store the JSON result as a string
    created_at = Column(DateTime(timezone=True), server_default=func.now())