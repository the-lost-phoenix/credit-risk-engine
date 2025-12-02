# app/schemas.py
from pydantic import BaseModel, Field, field_validator
from typing import Optional, Literal, List, Any
from datetime import datetime

# 1. The Input Schema (What the user sends)
class LoanApplicationCreate(BaseModel):
    full_name: str
    income: float
    loan_amount: float
    credit_score: int
    age: int
    years_employed: int
    gender: Literal["M", "F"]

# 2. The Output Schema (What we send back)
class LoanApplicationResponse(LoanApplicationCreate):
    id: int
    status: str
    created_at: datetime
    risk_score: float
    risk_factors: Optional[List[Any]] = None 
    user_id: Optional[int] = None

    @field_validator('risk_factors', mode='before')
    @classmethod
    def parse_risk_factors(cls, v):
        if isinstance(v, str):
            import json
            try:
                return json.loads(v)
            except:
                return []
        return v

    class Config:
        from_attributes = True

# --- AUTH SCHEMAS ---
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- HISTORY SCHEMAS ---
class RiskAnalysisHistoryCreate(BaseModel):
    user_id: int
    filename: str
    result: str # JSON string

class RiskAnalysisHistoryResponse(BaseModel):
    id: int
    filename: str
    result: str
    created_at: datetime
    
    class Config:
        from_attributes = True