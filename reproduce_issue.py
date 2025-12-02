import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "backend"))

from app import rule_engine, ml_service

def test_loan_application(income, loan_amount, credit_score, age, years_employed, gender):
    print(f"--- Testing Application ---")
    print(f"Income: {income}, Loan: {loan_amount}, Credit Score: {credit_score}")
    print(f"Age: {age}, Years Employed: {years_employed}, Gender: {gender}")

    # 1. Policy Check
    policy_check = rule_engine.run_policy_check(
        income=income,
        loan_amount=loan_amount,
        credit_score=credit_score
    )
    
    print(f"Policy Check: {policy_check}")
    
    if policy_check["status"] == "REJECTED":
        print("Result: REJECTED (Policy)")
        return

    # 2. ML Prediction
    result = ml_service.predict_loan_risk({
        "income": income,
        "loan_amount": loan_amount,
        "age": age,
        "years_employed": years_employed,
        "gender": gender
    })
    
    risk_score = result["score"]
    print(f"ML Risk Score: {risk_score}")
    print(f"Risk Factors: {result['factors']}")
    
    if risk_score > 70:
        print("Result: REJECTED_HIGH_RISK (ML)")
    else:
        print("Result: APPROVED")

if __name__ == "__main__":
    # Test Case 1: User's Case (Should Approve)
    test_loan_application(
        income=94500, 
        loan_amount=200000, 
        credit_score=780, 
        age=29, 
        years_employed=5, # Assumption
        gender="F"
    )
    sys.exit(0)
