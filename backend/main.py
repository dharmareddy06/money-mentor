import sys
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

# Add financial-engine to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "financial-engine")))
from logic import calculate_money_health_score, calculate_fire_path, calculate_tax_comparison

# AI Configuration
AI_API_KEY = os.getenv("AI_API_KEY")
AI_BASE_URL = os.getenv("AI_BASE_URL", "https://api.openai.com/v1")
AI_MODEL = os.getenv("AI_MODEL", "gpt-3.5-turbo")

# Initialize OpenAI-compatible client
client = None
if AI_API_KEY:
    client = OpenAI(
        api_key=AI_API_KEY,
        base_url=AI_BASE_URL
    )

app = FastAPI(title="AI Money Mentor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FinancialInputs(BaseModel):
    income: float
    expenses: float
    savings: float
    loans: float
    investments: float
    age: int
    retirement_age: Optional[int] = 60

class TaxInputs(BaseModel):
    annual_income: float
    deductions_80c: float = 0
    deductions_80d: float = 0
    deductions_nps: float = 0
    other_deductions: float = 0

class ChatMessage(BaseModel):
    message: str
    context: Optional[dict] = None

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Money Mentor API"}

@app.post("/health-score")
def get_health_score(inputs: FinancialInputs):
    try:
        results = calculate_money_health_score(
            inputs.income, 
            inputs.expenses, 
            inputs.savings, 
            inputs.loans, 
            inputs.investments
        )
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/fire-plan")
def get_fire_plan(inputs: FinancialInputs):
    try:
        combined_capital = inputs.savings + inputs.investments
        results = calculate_fire_path(
            inputs.age,
            inputs.income,
            inputs.expenses,
            combined_capital,
            inputs.retirement_age
        )
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tax-comparison")
def get_tax_comparison(inputs: TaxInputs):
    try:
        results = calculate_tax_comparison(
            inputs.annual_income,
            inputs.deductions_80c,
            inputs.deductions_80d,
            inputs.deductions_nps,
            inputs.other_deductions
        )
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat_with_mentor(chat_msg: ChatMessage):
    if not client:
        return {"reply": "AI Mentor is in offline mode (API Key missing). Please check your .env file."}
    
    try:
        system_prompt = """
        You are 'Money Mentor', a professional and friendly AI financial advisor for the Indian market.
        Your goal is to help users with:
        1. Money Health Score interpretation.
        2. FIRE (Financial Independence, Retire Early) planning.
        3. Tax optimization (Old vs New Regime).
        4. Mutual fund and investment advice.
        5. General personal finance queries.
        
        Always be encouraging, data-driven, and use Indian financial terminology (Lakhs, Crores, SIP, 80C, etc.).
        Keep responses concise and actionable.
        """
        
        user_context = f"User Context: {chat_msg.context}" if chat_msg.context else ""
        
        response = client.chat.completions.create(
            model=AI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"{user_context}\n\nUser: {chat_msg.message}"}
            ]
        )
        
        return {"reply": response.choices[0].message.content}
    except Exception as e:
        return {"reply": f"I'm having trouble connecting to my brain right now. Please ensure your AI_API_KEY and AI_BASE_URL are correct. Error: {str(e)}"}

@app.post("/ai-insights")
async def generate_ai_insights(inputs: FinancialInputs):
    if not client:
        return {"insights": [{
            "category": "Strategy",
            "insight": "Enable AI to see personalized insights.",
            "action": "Add your AI API key in the settings.",
            "priority": "medium"
        }]}
    
    try:
        health = calculate_money_health_score(inputs.income, inputs.expenses, inputs.savings, inputs.loans, inputs.investments)
        fire = calculate_fire_path(inputs.age, inputs.income, inputs.expenses, inputs.savings, inputs.retirement_age)
        
        prompt = f"""
        Analyze these financial metrics for an Indian user and provide 3-4 ultra-short, punchy, actionable AI insights:
        - Age: {inputs.age}
        - Retirement Age Goal: {inputs.retirement_age}
        - Monthly Income: ₹{inputs.income}
        - Monthly Expenses: ₹{inputs.expenses}
        - Total Savings: ₹{inputs.savings}
        - Total Loans/Debt: ₹{inputs.loans}
        - Total Investments: ₹{inputs.investments}
        - Health Score: {health['overall_score']}
        - FIRE Projected Savings: ₹{fire['projected_savings']}
        - FIRE Target: ₹{fire['fire_number']}
        
        Format: Return a JSON list of objects. Each object should have:
        - "category": Choose from ["Savings", "Debt", "Retirement", "Strategy"]
        - "insight": A punchy one-sentence insight.
        - "action": A concrete next step.
        - "priority": "high", "medium", or "low".
        
        No extra text, just the JSON list.
        """
        
        response = client.chat.completions.create(
            model=AI_MODEL,
            messages=[{"role": "user", "content": prompt}]
        )
        
        import json
        import re
        content = response.choices[0].message.content
        
        # Try to find JSON in the response if it's wrapped in markdown or extra text
        json_match = re.search(r'\[\s*\{.*\}\s*\]', content, re.DOTALL)
        if json_match:
            content = json_match.group(0)
            
        try:
            insights = json.loads(content)
        except:
            # Fallback if AI doesn't return clean JSON
            insights = [
                {"category": "Savings", "insight": "Watch your spending more closely this month.", "action": "Review unnecessary subscriptions.", "priority": "medium"},
                {"category": "Strategy", "insight": "Consider increasing your SIP by 10%.", "action": "Automate an extra ₹2000 per month.", "priority": "high"},
                {"category": "Savings", "insight": "Build your emergency fund to 6 months.", "action": "Move ₹20k to a liquid fund.", "priority": "high"}
            ]
            
        return {"insights": insights[:4]}
    except Exception as e:
        return {"insights": [
            {"category": "Savings", "insight": "Watch your spending more closely this month.", "action": "Use an expense tracker.", "priority": "medium"},
            {"category": "Strategy", "insight": "Consider increasing your SIP by 10%.", "action": "Increase monthly SIP amount.", "priority": "high"},
            {"category": "Savings", "insight": "Build your emergency fund to 6 months.", "action": "Set aside monthly contributions.", "priority": "high"}
        ]}

@app.post("/ai-actions")
async def generate_ai_actions(inputs: FinancialInputs):
    if not client:
        return {"actions": [
            {"title": "Tax Strategy", "description": "Optimize Section 80C to save more tax.", "icon": "Calculator", "color": "indigo"},
            {"title": "Retirement Boost", "description": "Increase index fund weightage for better alpha.", "icon": "PiggyBank", "color": "emerald"}
        ]}
    
    try:
        health = calculate_money_health_score(inputs.income, inputs.expenses, inputs.savings, inputs.loans, inputs.investments)
        fire = calculate_fire_path(inputs.age, inputs.income, inputs.expenses, inputs.savings + inputs.investments, inputs.retirement_age)
        
        prompt = f"""
        Based on this Indian user's profile, suggest 2 major, specific, high-impact financial 'moves' or 'actions':
        - Income: ₹{inputs.income}
        - Expenses: ₹{inputs.expenses}
        - Health Score: {health['overall_score']}
        - FIRE Gap: ₹{fire['gap']}
        
        Format: Return a JSON list of 2 objects. Each object should have:
        - "title": A short (2-3 words) catchy title.
        - "description": A one-sentence actionable description.
        - "icon": Choose from ["ShieldCheck", "PiggyBank", "TrendingUp", "Zap", "Calculator"]
        - "color": Choose from ["indigo", "emerald", "blue", "amber", "rose"]
        
        No extra text, just the JSON list.
        """
        
        response = client.chat.completions.create(
            model=AI_MODEL,
            messages=[{"role": "user", "content": prompt}]
        )
        
        import json
        import re
        content = response.choices[0].message.content
        json_match = re.search(r'\[\s*\{.*\}\s*\]', content, re.DOTALL)
        if json_match:
            content = json_match.group(0)
            
        try:
            actions = json.loads(content)
        except:
            actions = [
                {"title": "Emergency Fund", "description": "Prioritize building 6 months of buffer.", "icon": "ShieldCheck", "color": "rose"},
                {"title": "SIP Increase", "description": "Top up your monthly SIP by 10%.", "icon": "Zap", "color": "amber"}
            ]
            
        return {"actions": actions[:2]}
    except:
        return {"actions": [
            {"title": "Tax Strategy", "description": "Evaluate Old vs New regime carefully.", "icon": "Calculator", "color": "indigo"},
            {"title": "Debt Reduction", "description": "Clear high-interest loans first.", "icon": "TrendingUp", "color": "rose"}
        ]}

class RiskInputs(BaseModel):
    user_description: str

@app.post("/risk-profile")
async def generate_risk_profile(inputs: RiskInputs):
    if not client:
         return {"profile": "Moderate", "allocation": {"Equity": 60, "Debt": 30, "Gold": 10}}
    
    try:
        prompt = f"""
        Based on this user description: '{inputs.user_description}', determine their financial risk profile (Conservative, Moderate, Aggressive) and suggest an asset allocation.
        Return in JSON format: {{"profile": "...", "allocation": {{"Equity": %, "Debt": %, "Gold": %}}}}
        """
        response = client.chat.completions.create(
            model=AI_MODEL,
            messages=[{"role": "user", "content": prompt}]
        )
        import json
        return json.loads(response.choices[0].message.content)
    except:
        return {"profile": "Moderate", "allocation": {"Equity": 60, "Debt": 30, "Gold": 10}}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
