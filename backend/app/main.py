# app/main.py
import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import List, Optional
import pandas as pd
import io
import json
from datetime import timedelta
from sqlalchemy import text

from . import models, database, schemas, crud, rule_engine, auth_utils
from . import ml_service
from . import mock_bank
from .services import statement_analyzer

load_dotenv()

# Create the tables in the database (if they don't exist)
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Loan Default Prediction API")

# --- CORS CONFIGURATION ---
# Allow requests from your Frontend (React)
origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
origins = origins_str.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AUTH CONFIG ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- AUTH DEPENDENCIES ---
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = auth_utils.jwt.decode(token, auth_utils.SECRET_KEY, algorithms=[auth_utils.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except auth_utils.jwt.JWTError:
        raise credentials_exception
    
    user = crud.get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user

def get_current_user_optional(token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    # This is a bit tricky with OAuth2PasswordBearer as it might raise 401 if token is missing.
    # For simplicity, we'll use the same scheme but handle the error or just use a separate header check if needed.
    # However, OAuth2PasswordBearer(auto_error=False) allows optional tokens.
    return None # Placeholder if we want strictly optional. 
    # For now, let's assume the frontend decides whether to call the authenticated endpoint or not.
    # Actually, let's redefine oauth2_scheme for optional use:
    pass

oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="login", auto_error=False)

def get_optional_user(token: str = Depends(oauth2_scheme_optional), db: Session = Depends(get_db)):
    if not token:
        return None
    try:
        payload = auth_utils.jwt.decode(token, auth_utils.SECRET_KEY, algorithms=[auth_utils.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        return crud.get_user_by_email(db, email=email)
    except:
        return None

    is_risky = random.choice([True, False, False, False, False])
    bounce_count = 2 if is_risky else 0
    has_gambling = True if is_risky else False
    
    raw_statement = mock_bank.generate_bank_statement(
        salary=real_salary, 
        bounce_count=bounce_count, 
        gambling_flag=has_gambling
    )
    analysis = statement_analyzer.analyze_statement(raw_statement)
    return analysis

@app.post("/analyze-statement-file")
async def analyze_statement_file(
    file: UploadFile = File(...), 
    current_user: Optional[models.User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        
        # --- CLEAN UP HEADERS ---
        df.columns = [c.strip().lower() for c in df.columns]
        
        column_map = {
            "date": ["date", "txn_date", "transaction_date", "valuedt"],
            "amount": ["amount", "txn_amount", "transaction_amount"],
            "type": ["type", "txn_type", "dr_cr", "drcr"],
            "narration": ["narration", "description", "particulars", "remarks"]
        }

        for standard, variations in column_map.items():
            for var in variations:
                if var in df.columns:
                    df.rename(columns={var: standard}, inplace=True)
                    break
        
        if "chq/ref.no." in df.columns:
            df.rename(columns={"chq/ref.no.": "ref_no"}, inplace=True)

        # --- SPECIAL HANDLING: Split Amount Columns ---
        if "amount" not in df.columns and "withdrawalamt" in df.columns and "depositamt" in df.columns:
            def merge_amounts(row):
                w = pd.to_numeric(row['withdrawalamt'], errors='coerce') or 0
                d = pd.to_numeric(row['depositamt'], errors='coerce') or 0
                if d > 0: return d, "CREDIT"
                elif w > 0: return w, "DEBIT"
                else: return 0, "UNKNOWN"

            df[['amount', 'type']] = df.apply(lambda row: pd.Series(merge_amounts(row)), axis=1)

        required = ["date", "amount", "type", "narration"]
        if not all(col in df.columns for col in required):
             missing = [c for c in required if c not in df.columns]
             raise HTTPException(status_code=400, detail=f"CSV missing columns: {missing}. Found: {list(df.columns)}")

        transactions = df.to_dict(orient="records")
        analysis_result = statement_analyzer.analyze_statement({"transactions": transactions})
        
        # --- SAVE HISTORY IF LOGGED IN ---
        if current_user:
            # Convert result to JSON string
            result_json = json.dumps(analysis_result)
            crud.create_history_entry(db, schemas.RiskAnalysisHistoryCreate(
                user_id=current_user.id,
                filename=file.filename,
                result=result_json
            ))
        # ---------------------------------

        return analysis_result
        
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=400, detail=f"Error reading file: {str(e)}")