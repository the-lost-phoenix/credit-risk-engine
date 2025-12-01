# app/services/statement_analyzer.py

def analyze_statement(statement_json: dict):
    transactions = statement_json.get("transactions", [])
    
    total_salary_credits = 0
    salary_count = 0
    bounces = 0
    gambling_flags = 0
    
    # Calculate Average Closing Balance (if available)
    total_balance = 0
    balance_count = 0

    for txn in transactions:
        narration = txn["narration"].upper()
        amount = txn["amount"]
        txn_type = txn["type"]
        
        # 1. Detect Salary
        # Logic: Credit > 10000 AND contains "SALARY" or "ACH"
        if txn_type == "CREDIT" and amount > 10000 and ("SALARY" in narration or "ACH" in narration):
            total_salary_credits += amount
            salary_count += 1
            
        # 2. Detect Bounces
        if "BOUNCE" in narration or "RETURN" in narration:
            bounces += 1
            
        # 3. Detect Gambling
        if "DREAM11" in narration or "RUMMY" in narration or "BET365" in narration:
            gambling_flags += 1

        # 4. Closing Balance Accumulation
        if "closingbalance" in txn:
            try:
                # Handle potential string/float issues
                bal = float(txn["closingbalance"])
                total_balance += bal
                balance_count += 1
            except:
                pass

    # Calculate Average Salary
    estimated_salary = total_salary_credits / salary_count if salary_count > 0 else 0
    
    # Calculate Average Balance
    avg_balance = total_balance / balance_count if balance_count > 0 else 0
    
    return {
        "estimated_salary": estimated_salary,
        "cheque_bounces": bounces,
        "gambling_count": gambling_flags,
        "average_balance": avg_balance,
        "is_verified": True
    }