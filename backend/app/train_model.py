# backend/app/train_model.py
import pandas as pd
import numpy as np
from catboost import CatBoostClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, accuracy_score
import joblib
import os

# 1. Configuration
# Where is the file?
DATA_PATH = "C:/Users/vijay/credit-risk-engine/backend/data/application_train.csv"
MODEL_PATH = "ml_model.joblib"

def train():
    print("--- 🚀 Starting Model Training Pipeline ---")
    
    # 2. Load Data
    # We only load the columns we actually need to save memory
    required_columns = [
        "TARGET", 
        "AMT_INCOME_TOTAL", 
        "AMT_CREDIT", 
        "AMT_ANNUITY",
        "DAYS_BIRTH", 
        "DAYS_EMPLOYED", 
        "NAME_CONTRACT_TYPE", 
        "CODE_GENDER"
    ]
    
    print(f"Loading data from {DATA_PATH}...")
    if not os.path.exists(DATA_PATH):
        print("❌ Error: File not found! Did you put application_train.csv in the 'data' folder?")
        return

    df = pd.read_csv(DATA_PATH, usecols=required_columns)
    print(f"Data Loaded: {df.shape[0]} rows.")

    # 3. Preprocessing (Cleaning)
    print("Cleaning data...")
    
    # Fill missing numbers with the Median (middle value)
    df["AMT_ANNUITY"] = df["AMT_ANNUITY"].fillna(df["AMT_ANNUITY"].median())
    
    # Feature Engineering: Convert 'Days Birth' (e.g. -15000) to 'Age' (e.g. 41)
    df["AGE_YEARS"] = -df["DAYS_BIRTH"] / 365
    
    # Feature Engineering: Convert 'Days Employed' to 'Years Employed'
    # Note: 365243 is a magic number in this dataset for "Unemployed", let's handle it
    df["YEARS_EMPLOYED"] = -df["DAYS_EMPLOYED"] / 365
    df.loc[df["YEARS_EMPLOYED"] < 0, "YEARS_EMPLOYED"] = 0 # Fix weird negative values if any
    
    # Drop the original confusing columns
    df = df.drop(columns=["DAYS_BIRTH", "DAYS_EMPLOYED"])

    # 4. Prepare X (Inputs) and y (Output)
    y = df["TARGET"]
    X = df.drop(columns=["TARGET"])
    
    # Identify Categorical Columns (Text) so CatBoost handles them automatically
    cat_features = ["NAME_CONTRACT_TYPE", "CODE_GENDER"]

    # 5. Split Data (80% for Training, 20% for Testing)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    # 6. Initialize the Brain (CatBoost)
    # scale_pos_weight=11: This is CRITICAL.
    # Defaulters are rare (only ~8%). If we don't add this, the model will just guess "Repaid" 
    # every time and get 92% accuracy but miss all the fraudsters.
    # Weight 11 forces it to pay 11x more attention to mistakes on Defaulters.
    model = CatBoostClassifier(
        iterations=500,         # How many times to loop
        depth=6,                # How complex the trees are
        learning_rate=0.1,      # How fast it learns
        cat_features=cat_features,
        scale_pos_weight=11,    # Handle Class Imbalance
        verbose=100             # Print status every 100 steps
    )

    # 7. Train
    print("Training Model (This might take a minute)...")
    model.fit(X_train, y_train)

    # 8. Evaluate
    print("Evaluating...")
    preds_proba = model.predict_proba(X_test)[:, 1] # Probability of Default (0 to 1)
    auc_score = roc_auc_score(y_test, preds_proba)
    print(f"✅ Model ROC-AUC Score: {auc_score:.4f} (Good is > 0.70)")

    # 9. Save
    print(f"Saving model to {MODEL_PATH}...")
    joblib.dump(model, MODEL_PATH)
    print("🎉 Success! Model is saved and ready for the API.")

if __name__ == "__main__":
    train()