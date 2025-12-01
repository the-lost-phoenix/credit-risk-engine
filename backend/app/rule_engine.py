# app/rule_engine.py

def run_policy_check(income: float, loan_amount: float, credit_score: int):
    """
    Returns a dictionary with decision: "APPROVED", "REJECTED", "MANUAL_REVIEW"
    and a reason for the decision.
    """
    
    # Rule 1: The "CIBIL" Cutoff
    # In India, < 650 is usually considered sub-prime.
    if credit_score < 650:
        return {
            "status": "REJECTED", 
            "reason": "Credit Score below policy threshold (650)."
        }

    # Rule 2: Loan-to-Income Ratio
    # We shouldn't lend more than 10x monthly income (simplified rule)
    max_loan_limit = income * 10
    if loan_amount > max_loan_limit:
        return {
            "status": "REJECTED",
            "reason": f"Loan amount exceeds 10x monthly income limit. Max allowed: {max_loan_limit}"
        }

    # If they pass all rules
    return {
        "status": "APPROVED",
        "reason": "Passed all preliminary policy checks."
    }