# app/ml_service.py
import joblib
import pandas as pd
import os
from catboost import Pool

MODEL_PATH = os.path.join(os.path.dirname(__file__), "ml_model.joblib")

try:
    model = joblib.load(MODEL_PATH)
    print("✅ ML Model Loaded Successfully")
except Exception as e:
    print(f"❌ Failed to load model: {e}")
    model = None

def predict_loan_risk(input_data: dict):
    if model is None:
        return {"score": 0, "factors": []}

    # 1. Prepare Data
    df = pd.DataFrame([{
        "AMT_INCOME_TOTAL": input_data["income"],
        "AMT_CREDIT": input_data["loan_amount"],
        "AMT_ANNUITY": input_data["loan_amount"] / 12,
        "AGE_YEARS": input_data["age"],
        "YEARS_EMPLOYED": input_data["years_employed"],
        "NAME_CONTRACT_TYPE": "Cash loans",
        "CODE_GENDER": input_data["gender"]
    }])
    
    # 2. Reorder Columns (Crucial!)
    expected_order = [
        "NAME_CONTRACT_TYPE", "CODE_GENDER", "AMT_INCOME_TOTAL", 
        "AMT_CREDIT", "AMT_ANNUITY", "AGE_YEARS", "YEARS_EMPLOYED"
    ]
    df = df[expected_order]

    # 3. Get Probability
    probability = model.predict_proba(df)[0][1]
    risk_score = float(probability * 100)
    print(f"🔍 Calculated Risk Score: {risk_score}")

    # 4. EXPLAINABILITY (The Magic) 
    # specific_feature_indices tells CatBoost we want SHAP values
    pool = Pool(df, cat_features=["NAME_CONTRACT_TYPE", "CODE_GENDER"])
    shap_values = model.get_feature_importance(pool, type='ShapValues')
    
    # shap_values returns a matrix. We want the first row (our user).
    # The last value in the array is the "Bias", we ignore it.
    user_shap = shap_values[0][:-1]
    
    # 5. Map values to Feature Names
    feature_importance = []
# app/ml_service.py
import joblib
import pandas as pd
import os
from catboost import Pool

MODEL_PATH = os.path.join(os.path.dirname(__file__), "ml_model.joblib")

try:
    model = joblib.load(MODEL_PATH)
    print("✅ ML Model Loaded Successfully")
except Exception as e:
    print(f"❌ Failed to load model: {e}")
    model = None

def predict_loan_risk(input_data: dict):
    if model is None:
        return {"score": 0, "factors": []}

    # 1. Prepare Data
    df = pd.DataFrame([{
        "AMT_INCOME_TOTAL": input_data["income"],
        "AMT_CREDIT": input_data["loan_amount"],
        "AMT_ANNUITY": input_data["loan_amount"] / 12,
        "AGE_YEARS": input_data["age"],
        "YEARS_EMPLOYED": input_data["years_employed"],
        "NAME_CONTRACT_TYPE": "Cash loans",
        "CODE_GENDER": input_data["gender"]
    }])
    
    # 2. Reorder Columns (Crucial!)
    expected_order = [
        "NAME_CONTRACT_TYPE", "CODE_GENDER", "AMT_INCOME_TOTAL", 
        "AMT_CREDIT", "AMT_ANNUITY", "AGE_YEARS", "YEARS_EMPLOYED"
    ]
    df = df[expected_order]

    # 3. Get Probability
    probability = model.predict_proba(df)[0][1]
    risk_score = float(probability * 100)
    print(f"🔍 Calculated Risk Score: {risk_score}")

    # 4. EXPLAINABILITY (The Magic) 
    # specific_feature_indices tells CatBoost we want SHAP values
    pool = Pool(df, cat_features=["NAME_CONTRACT_TYPE", "CODE_GENDER"])
    shap_values = model.get_feature_importance(pool, type='ShapValues')
    
    # shap_values returns a matrix. We want the first row (our user).
    # The last value in the array is the "Bias", we ignore it.
    user_shap = shap_values[0][:-1]
    
    # 5. Map values to Feature Names
    feature_importance = []
    for name, score in zip(expected_order, user_shap):
        feature_importance.append({
            "feature": name,
            "shap_score": float(score)
        })
    
    # 6. Sort by "Impact" (Magnitude of impact - Absolute Value)
    # We want to show the biggest drivers, whether they are positive (Risk) or negative (Safety)
    feature_importance.sort(key=lambda x: abs(x["shap_score"]), reverse=True)
    
    # Take top 5 reasons
    top_5_reasons = feature_importance[:5]

    return {
        "score": risk_score,
        "factors": top_5_reasons
    }