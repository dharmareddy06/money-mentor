def calculate_money_health_score(income: float, expenses: float, savings: float, loans: float, investments: float) -> dict:
    """
    Calculates a comprehensive financial health score (0-100).
    Refined for Indian Household context.
    """
    # 1. Savings Ratio (Goal: 40% of income is ideal for growth)
    monthly_surplus = max(0, income - expenses)
    savings_ratio = (monthly_surplus / income) if income > 0 else 0
    savings_ratio_score = min(100, (savings_ratio / 0.4) * 100)
    
    # 2. Emergency Preparedness (Goal: 6 months of expenses)
    target_emergency_fund = expenses * 6
    emergency_fund_score = min(100, (savings / target_emergency_fund * 100)) if target_emergency_fund > 0 else 100
    
    # 3. Debt Health (Goal: Debt-to-Income ratio < 35% for Indian contexts)
    debt_to_income = (loans / income) if income > 0 else 0
    debt_health_score = max(0, 100 - (debt_to_income / 0.35 * 100))
    
    # 4. Investment Maturity (Goal: Investments >= 12x Monthly Income)
    investment_maturity_ratio = (investments / (income * 12)) if income > 0 else 0
    investment_score = min(100, (investment_maturity_ratio / 1.0 * 100))
    
    # Final Score (Weighted)
    weights = {
        "savings": 0.35,
        "emergency": 0.30,
        "debt": 0.15,
        "investment": 0.20
    }
    
    final_score = (
        savings_ratio_score * weights["savings"] +
        emergency_fund_score * weights["emergency"] +
        debt_health_score * weights["debt"] +
        investment_score * weights["investment"]
    )
    
    status = "Excellent" if final_score > 80 else "Good" if final_score > 60 else "Average" if final_score > 40 else "Needs Attention"
    
    return {
        "overall_score": round(final_score, 2),
        "status": status,
        "breakdown": {
            "savings": round(savings_ratio_score, 1),
            "emergency": round(emergency_fund_score, 1),
            "debt": round(debt_health_score, 1),
            "investment": round(investment_score, 1)
        }
    }

def calculate_fire_path(age: int, income: float, expenses: float, current_capital: float, target_retirement_age: int = 60) -> dict:
    """
    Calculates the path to Financial Independence, Retire Early (FIRE).
    Refined for Indian context with inflation and realistic returns.
    """
    years_to_retire = target_retirement_age - age
    if years_to_retire <= 0:
        return {"error": "Already at or past retirement age"}
    
    inflation_rate = 0.06
    pre_retirement_return = 0.12 # Assuming 12% annual return on SIP/Investments
    
    # Calculate future value of expenses at time of retirement
    annual_expenses_current = expenses * 12
    future_annual_expenses = annual_expenses_current * (1 + inflation_rate) ** years_to_retire
    
    # Corpus needed using a 30x multiplier (conservative Withdrawal Rate of 3.33%)
    fire_number = future_annual_expenses * 30
    
    # Helper for future value of current capital and future SIPs
    def calculate_fv(pv, pmt, r, n):
        # pv: present value, pmt: monthly payment, r: monthly rate, n: total months
        if r == 0:
            return pv + pmt * n
        return pv * (1 + r)**n + pmt * (((1 + r)**n - 1) / r)
    
    monthly_rate = pre_retirement_return / 12
    total_months = years_to_retire * 12
    monthly_savings = max(0, income - expenses)
    
    projected_savings = calculate_fv(current_capital, monthly_savings, monthly_rate, total_months)
    
    # Calculate required SIP if there's a gap
    is_on_track = projected_savings >= fire_number
    gap = max(0, fire_number - projected_savings)
    
    required_sip = 0
    if gap > 0:
        # Calculate monthly payment (SIP) needed to reach gap at retirement
        # Gap = SIP * (((1 + r)^n - 1) / r)
        required_sip = gap * monthly_rate / ((1 + monthly_rate)**total_months - 1)
    
    return {
        "fire_number": round(fire_number, 2),
        "projected_savings": round(projected_savings, 2),
        "future_monthly_expenses": round(future_annual_expenses / 12, 2),
        "years_to_retire": years_to_retire,
        "is_on_track": is_on_track,
        "gap": round(gap, 2),
        "required_sip": round(required_sip, 2)
    }

def calculate_tax_comparison(annual_income: float, deductions_80c: float = 0, deductions_80d: float = 0, deductions_nps: float = 0, other_deductions: float = 0) -> dict:
    """
    Compares Old vs New Tax Regime (India Budget 2024 - July Revision).
    """
    # 1. New Regime (FY 2024-25 Revision)
    standard_deduction_new = 75000
    taxable_income_new = max(0, annual_income - standard_deduction_new)
    
    tax_new = 0
    # Slabs: 0-3L Nil, 3-7L 5%, 7-10L 10%, 10-12L 15%, 12-15L 20%, 15L+ 30%
    if taxable_income_new > 300000:
        if taxable_income_new <= 700000:
            tax_new = (taxable_income_new - 300000) * 0.05
        elif taxable_income_new <= 1000000:
            tax_new = 20000 + (taxable_income_new - 700000) * 0.10
        elif taxable_income_new <= 1200000:
            tax_new = 50000 + (taxable_income_new - 1000000) * 0.15
        elif taxable_income_new <= 1500000:
            tax_new = 80000 + (taxable_income_new - 1200000) * 0.20
        else:
            tax_new = 140000 + (taxable_income_new - 1500000) * 0.30

    # Rebate u/s 87A for New Regime (up to 7L taxable income)
    if taxable_income_new <= 700000:
        tax_new = 0

    # 2. Old Regime
    standard_deduction_old = 50000
    # Additional 50k for NPS u/s 80CCD(1B)
    total_deductions_old = standard_deduction_old + min(150000, deductions_80c) + min(50000, deductions_80d) + min(50000, deductions_nps) + other_deductions
    taxable_income_old = max(0, annual_income - total_deductions_old)
    
    tax_old = 0
    # Slabs: 0-2.5L Nil, 2.5-5L 5%, 5-10L 20%, 10L+ 30%
    if taxable_income_old > 250000:
        if taxable_income_old <= 500000:
            tax_old = (taxable_income_old - 250000) * 0.05
        elif taxable_income_old <= 1000000:
            tax_old = 12500 + (taxable_income_old - 500000) * 0.20
        else:
            tax_old = 112500 + (taxable_income_old - 1000000) * 0.30
        
    # Rebate u/s 87A for Old Regime (up to 5L taxable income)
    if taxable_income_old <= 500000:
        tax_old = 0

    cess = 1.04 # 4% health and education cess
    tax_new *= cess
    tax_old *= cess
    
    recommendation = "New" if tax_new <= tax_old else "Old"
    
    return {
        "new_regime_tax": round(tax_new, 2),
        "old_regime_tax": round(tax_old, 2),
        "taxable_income_new": round(taxable_income_new, 2),
        "taxable_income_old": round(taxable_income_old, 2),
        "recommendation": recommendation,
        "savings": round(abs(tax_new - tax_old), 2),
        "potential_optimizations": [
            "Maximize 80C (PPF/ELSS/LIC) up to ₹1.5L" if deductions_80c < 150000 else None,
            "Utilize NPS (80CCD 1B) for extra ₹50k exemption" if deductions_nps < 50000 else None,
            "Health Insurance premium (80D) up to ₹25k-50k" if deductions_80d < 25000 else None
        ]
    }

