# AI Money Mentor - Your Personal Finance Copilot

AI Money Mentor is a premium, AI-powered personal finance advisor specifically designed for the Indian market. It bridges the gap between complex financial planning and everyday users, making wealth management as simple as a conversation.

---

## Key Features

### Money Health Score
A comprehensive financial wellness evaluation system based on income, expenses, savings, and debt.
- **Goal**: Holistic visibility into financial preparedness.
- **Breakdown**: Debt health, Emergency fund, and diversification.

### FIRE Path Planner (Financial Independence, Retire Early)
A personalized roadmap to retiring early in India.
- **Inputs**: Age, current capital, monthly savings.
- **Outputs**: SIP strategy, retirement timeline, and target "FIRE Number."

### Tax Wizard (India Specific)
Compare the **Old vs. New Tax Regime** (Budget 2024-25) and discover tax-saving opportunities under Sections 80C, 80D, and more.

### AI Financial Chatbot
A context-aware assistant that understands your financial data and provides actionable, data-driven advice in natural language.

---

## Tech Stack

- **Frontend**: React.js 18, TypeScript, Tailwind CSS, Vite.
- **Backend**: FastAPI (Python), OpenAI API, Python-dotenv.
- **Financial Engine**: Customized logic for Indian tax laws, investment math, and FIRE calculations.
- **Icons**: Lucide React.

---

## Quick Start

### Prerequisites
- Python 3.9 or higher
- Node.js 18 or higher

### Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
# or: source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
```

#### Configure Environment Variables
Create a `.env` file in the `backend/` directory:
```env
AI_API_KEY=your_api_key
AI_BASE_URL=https://api.groq.com/openai/v1
AI_MODEL=llama-3.3-70b-versatile
```
*Note: The app will run in offline mode with limited logic if no API key is provided.*

#### Start Backend
```bash
python main.py
```
The API will be available at `http://localhost:8000`.

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The application will launch at `http://localhost:5173`.

---

## Project Structure

- `/backend`: FastAPI server and API endpoints.
- `/frontend`: React application, UI components, and styling.
- `/financial-engine`: Core mathematical logic for tax and FIRE.
- `/ai-module`: Intelligent prompts and context generation for the AI.

---

