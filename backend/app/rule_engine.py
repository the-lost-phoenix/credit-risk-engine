# app/rule_engine.py
from . import schemas

def run_policy_check(application: schemas.LoanApplicationCreate):
    """
    Returns a tuple (status, reason).
    Status: "APPROVED" or "REJECTED"
    """
    
    # Rule 1: The "CIBIL" Cutoff
    # In India, < 650 is usually considered sub-prime.
    if application.credit_score < 650:
        return "REJECTED", "Credit Score below policy threshold (650)."

    # Rule 2: Loan-to-Income Ratio
    # We shouldn't lend more than 10x monthly income (simplified rule)
    max_loan_limit = application.income * 10
    if application.loan_amount > max_loan_limit:
        return "REJECTED", f"Loan amount exceeds 10x monthly income limit. Max allowed: {max_loan_limit}"

    # If they pass all rules
    return "APPROVED", "Passed all preliminary policy checks."