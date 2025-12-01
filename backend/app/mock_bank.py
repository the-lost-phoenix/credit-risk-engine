# app/mock_bank.py
import random
from datetime import datetime, timedelta

def generate_bank_statement(salary: float, bounce_count: int, gambling_flag: bool):
    """
    Generates a fake 6-month bank statement JSON.
    """
    transactions = []
    current_date = datetime.now()
    
    # 1. Generate 6 months of data
    for i in range(6):
        month_date = current_date - timedelta(days=30 * i)
        
        # A. The Salary Entry (Once per month)
        # FIX IS HERE: Changed "%Y-%m-%05" to "%Y-%m-05"
        transactions.append({
            "date": month_date.strftime("%Y-%m-05"), 
            "amount": salary,
            "type": "CREDIT",
            "narration": "ACH CR: SALARY TRANSFER INFOSYS LTD"
        })
        
        # B. Random Expenses
        for _ in range(5):
            transactions.append({
                "date": month_date.strftime("%Y-%m-%d"),
                "amount": random.randint(500, 2000),
                "type": "DEBIT",
                "narration": "UPI-SWIGGY-XYZ"
            })

    # 2. Inject "Red Flags" if requested
    if bounce_count > 0:
        for _ in range(bounce_count):
            transactions.append({
                "date": current_date.strftime("%Y-%m-%d"),
                "amount": 500,
                "type": "DEBIT",
                "narration": "CHQ BOUNCE CHARGES - INSUFFICIENT FUNDS"
            })
            
    if gambling_flag:
        transactions.append({
            "date": current_date.strftime("%Y-%m-%d"),
            "amount": 5000,
            "type": "DEBIT",
            "narration": "UPI-DREAM11-GAMING"
        })

    return {"transactions": transactions}