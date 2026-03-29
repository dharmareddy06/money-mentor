import { useState } from 'react';
import axios from 'axios';
import { 
  TrendingUp, 
  Wallet, 
  PiggyBank, 
  ShieldCheck, 
  Zap,
  ChevronRight,
  PieChart as PieChartIcon,
  Calculator,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import ChatBot from './components/ChatBot';
import AIInsights from './components/AIInsights';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [inputs, setInputs] = useState({
    income: 150000,
    expenses: 60000,
    savings: 800000,
    loans: 500000,
    investments: 1200000,
    age: 28,
    retirement_age: 55,
    tax_80c: 150000,
    tax_80d: 25000,
    tax_nps: 0
  });

  const [healthScore, setHealthScore] = useState<any>(null);
  const [firePlan, setFirePlan] = useState<any>(null);
  const [taxData, setTaxData] = useState<any>(null);
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const calculateResults = async () => {
    setLoading(true);
    try {
      const healthRes = await axios.post(`${API_BASE_URL}/health-score`, inputs);
      const fireRes = await axios.post(`${API_BASE_URL}/fire-plan`, inputs);
      const taxRes = await axios.post(`${API_BASE_URL}/tax-comparison`, {
        annual_income: inputs.income * 12,
        deductions_80c: inputs.tax_80c,
        deductions_80d: inputs.tax_80d,
        deductions_nps: inputs.tax_nps
      });
      const actionsRes = await axios.post(`${API_BASE_URL}/ai-actions`, inputs);
      setHealthScore(healthRes.data);
      setFirePlan(fireRes.data);
      setTaxData(taxRes.data);
      setActions(actionsRes.data.actions);
    } catch (error) {
      console.error("Error fetching data", error);
    }
    setLoading(false);
  };

  const pieData = [
    { name: 'Expenses', value: inputs.expenses, color: '#f87171' },
    { name: 'Investments', value: inputs.investments / 12, color: '#60a5fa' },
    { name: 'Debt EMI', value: inputs.loans * 0.01, color: '#f59e0b' },
    { name: 'Savings Surge', value: (inputs.income - inputs.expenses - (inputs.loans * 0.01)), color: '#4ade80' },
  ].filter(d => d.value > 0);

  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/10">
            <TrendingUp className="text-black w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white italic">Money Mentor AI</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-zinc-500 hidden md:block">Hackathon Build v2.0</span>
          <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-colors border border-zinc-700">
            Connect Bank
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
              <Wallet className="w-5 h-5 text-zinc-400" />
              Financial Profile
            </h2>
            
            <div className="space-y-4">
              <div>
                  <label className="block text-sm text-zinc-400 mb-1">Monthly Income (₹)</label>
                <input 
                  type="number" 
                  value={inputs.income}
                  onChange={(e) => setInputs({...inputs, income: Number(e.target.value)})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-mono"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Monthly Expenses (₹)</label>
                <input 
                  type="number" 
                  value={inputs.expenses}
                  onChange={(e) => setInputs({...inputs, expenses: Number(e.target.value)})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Total Savings (₹)</label>
                  <input 
                    type="number" 
                    value={inputs.savings}
                    onChange={(e) => setInputs({...inputs, savings: Number(e.target.value)})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Total Debt (₹)</label>
                  <input 
                    type="number" 
                    value={inputs.loans}
                    onChange={(e) => setInputs({...inputs, loans: Number(e.target.value)})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Total Investments (₹)</label>
                <input 
                  type="number" 
                  value={inputs.investments}
                  onChange={(e) => setInputs({...inputs, investments: Number(e.target.value)})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Current Age</label>
                  <input 
                    type="number" 
                    value={inputs.age}
                    onChange={(e) => setInputs({...inputs, age: Number(e.target.value)})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">FIRE Target Age</label>
                  <input 
                    type="number" 
                    value={inputs.retirement_age}
                    onChange={(e) => setInputs({...inputs, retirement_age: Number(e.target.value)})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  />
                </div>
              </div>

              {/* Tax Deductions Section */}
              <div className="pt-4 border-t border-zinc-800">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Tax Optimization (Annual)</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">Section 80C (₹)</label>
                      <input 
                        type="number" 
                        value={inputs.tax_80c}
                        onChange={(e) => setInputs({...inputs, tax_80c: Number(e.target.value)})}
                        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">Section 80D (₹)</label>
                      <input 
                        type="number" 
                        value={inputs.tax_80d}
                        onChange={(e) => setInputs({...inputs, tax_80d: Number(e.target.value)})}
                        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1">NPS - 80CCD(1B) (₹)</label>
                    <input 
                      type="number" 
                      value={inputs.tax_nps}
                      onChange={(e) => setInputs({...inputs, tax_nps: Number(e.target.value)})}
                      className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-mono"
                      placeholder="Max 50,000"
                    />
                  </div>
                </div>
              </div>
              
              <button 
                onClick={calculateResults}
                disabled={loading}
                className="w-full bg-white hover:bg-zinc-200 text-black font-semibold py-3 rounded-xl mt-4 transition-all shadow-lg shadow-white/10 flex items-center justify-center gap-2"
              >
                {loading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Zap className="w-5 h-5" />}
                AI Analysis
              </button>
            </div>
          </div>
          
          {healthScore && <AIInsights inputs={inputs} />}
        </section>

        {/* Right Column: Dashboard */}
        <section className="lg:col-span-8 space-y-8">
          {healthScore ? (
            <>
              {/* Score Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-zinc-800 to-black p-8 rounded-3xl text-white shadow-xl shadow-white/5 relative overflow-hidden group border border-zinc-800">
                  <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <ShieldCheck className="w-48 h-48" />
                  </div>
                  <h3 className="text-zinc-400 font-medium mb-1 uppercase text-xs tracking-widest leading-none">Wealth Health Grade</h3>
                  <div className="flex items-baseline gap-4 mb-4">
                    <div className="text-6xl font-bold">{Math.round(healthScore.overall_score)}</div>
                    <div className="text-xl font-medium text-zinc-500">/ 100</div>
                  </div>
                  <div className="bg-white/10 h-1.5 w-full rounded-full overflow-hidden">
                    <div className="bg-white h-full transition-all duration-1000 ease-out" style={{ width: `${healthScore.overall_score}%` }}></div>
                  </div>
                  <p className="mt-4 text-white text-sm font-semibold italic flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-zinc-400" />
                    Status: {healthScore.status}
                  </p>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl relative overflow-hidden group flex flex-col justify-center">
                  <h3 className="text-zinc-400 font-medium mb-1 uppercase text-xs tracking-widest leading-none">Retirement Corpus (FIRE)</h3>
                  {firePlan && (
                    <>
                      <div className="text-4xl font-bold text-white mb-1">₹{(firePlan.fire_number / 10000000).toFixed(2)} Cr</div>
                      <p className="text-zinc-500 text-[10px] uppercase tracking-wider mb-4">Inflation-Adjusted Target</p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-zinc-400">Future Monthly Exp:</span>
                          <span className="text-white font-mono">₹{Math.round(firePlan.future_monthly_expenses).toLocaleString()}</span>
                        </div>
                        {firePlan.required_sip > 0 && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-white font-semibold">Required Monthly SIP:</span>
                            <span className="text-white font-bold font-mono">₹{Math.round(firePlan.required_sip).toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      <div className={`mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${firePlan.is_on_track ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                        {firePlan.is_on_track ? '🎯 On Track' : '⚠️ Gap: ₹' + (firePlan.gap / 10000000).toFixed(2) + ' Cr'}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Savings', val: healthScore.breakdown.savings, color: 'text-zinc-400' },
                  { label: 'Emergency', val: healthScore.breakdown.emergency, color: 'text-zinc-500' },
                  { label: 'Debt', val: healthScore.breakdown.debt, color: 'text-zinc-300' },
                  { label: 'Invest', val: healthScore.breakdown.investment, color: 'text-white' }
                ].map((item) => (
                  <div key={item.label} className="bg-zinc-900/30 border border-zinc-800 p-4 rounded-2xl text-center">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">{item.label}</div>
                    <div className={`text-xl font-bold ${item.color}`}>{Math.round(item.val)}%</div>
                  </div>
                ))}
              </div>

              {/* AI Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Tax Wizard Section */}
                {taxData && (
                  <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
                    <h3 className="text-white font-semibold flex items-center gap-2 mb-6 text-sm">
                      <Calculator className="w-5 h-5 text-zinc-400" />
                      Tax Minimization (FY 24-25)
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700 text-center">
                        <div className="text-[10px] text-zinc-400 uppercase mb-1">New Regime</div>
                        <div className="text-lg font-bold text-white">₹{(taxData.new_regime_tax/1000).toFixed(1)}k</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700 text-center">
                        <div className="text-[10px] text-zinc-400 uppercase mb-1">Old Regime</div>
                        <div className="text-lg font-bold text-white">₹{(taxData.old_regime_tax/1000).toFixed(1)}k</div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 rounded-2xl bg-white/5 border border-white/10">
                        <div className="text-[10px] text-zinc-400 font-bold uppercase mb-1 text-center">AI Recommendation</div>
                        <p className="text-xs text-zinc-300 text-center">Switch to <strong>{taxData.recommendation} Regime</strong> to save ₹{taxData.savings.toLocaleString()}</p>
                    </div>
                    {taxData.potential_optimizations && taxData.potential_optimizations.filter((o: any) => o).length > 0 && (
                      <div className="mt-4 space-y-2">
                        <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Optimization Tips</div>
                        {taxData.potential_optimizations.map((opt: string, i: number) => opt && (
                          <div key={i} className="flex items-center gap-2 text-[10px] text-zinc-400 bg-zinc-800/30 p-2 rounded-lg border border-zinc-700/50">
                            <Lightbulb className="w-3 h-3 text-zinc-400" />
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* AI Risk Profile Card */}
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl relative overflow-hidden group">
                  <h3 className="text-white font-semibold flex items-center gap-2 mb-6">
                    <ShieldCheck className="w-5 h-5 text-zinc-400" />
                    AI Risk Profiler
                  </h3>
                  <div className="space-y-4">
                    <textarea 
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all h-20 placeholder:text-zinc-600"
                      placeholder="Describe your financial goals and fears..."
                    />
                    <button className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 py-2 rounded-xl text-xs font-semibold text-white transition-all">Generate AI Profile</button>
                  </div>
                </div>
              </div>

              {/* Chart Section */}
              <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-zinc-400" />
                    Allocation Overview
                  </h3>
                </div>
                <div className="h-[200px] w-full flex items-center justify-center">
                   <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', color: '#f8fafc' }}
                        itemStyle={{ color: '#f8fafc' }}
                        formatter={(val: any) => `₹${Number(val).toLocaleString()}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 ml-8">
                    {pieData.map((d) => (
                      <div key={d.name} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                        <span className="text-xs text-zinc-400">{d.name}: ₹{(d.value/1000).toFixed(0)}k</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actionable Advice */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-zinc-400" />
                  AI Suggested Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {actions.length > 0 ? (
                    actions.map((action, i) => {
                      const icons: Record<string, any> = {
                        ShieldCheck,
                        PiggyBank,
                        TrendingUp,
                        Zap,
                        Calculator
                      };
                      const Icon = icons[action.icon] || Zap;

                      return (
                        <div key={i} className="group bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl hover:bg-zinc-800/50 transition-all cursor-pointer">
                          <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-white/10 text-white group-hover:bg-white group-hover:text-black`}>
                               <Icon className={`w-6 h-6`} />
                            </div>
                            <ChevronRight className={`w-5 h-5 text-zinc-600 transition-colors group-hover:text-white`} />
                          </div>
                          <h4 className="font-semibold text-white mb-1 italic">{action.title}</h4>
                          <p className="text-xs text-zinc-400">{action.description}</p>
                        </div>
                      );
                    })
                  ) : (
                    <>
                      <div className="group bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl hover:bg-zinc-800/50 transition-all cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-white/10 rounded-xl text-white group-hover:bg-white group-hover:text-black transition-all">
                             <ShieldCheck className="w-6 h-6" />
                          </div>
                          <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
                        </div>
                        <h4 className="font-semibold text-white mb-1 italic">Tax Strategy</h4>
                        <p className="text-xs text-zinc-400">Optimize Section 80C to save an additional ₹15,000.</p>
                      </div>
                      <div className="group bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl hover:bg-zinc-800/50 transition-all cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-white/10 rounded-xl text-white group-hover:bg-white group-hover:text-black transition-all">
                             <PiggyBank className="w-6 h-6" />
                          </div>
                          <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
                        </div>
                        <h4 className="font-semibold text-white mb-1 italic">Retirement Boost</h4>
                        <p className="text-xs text-zinc-400">Increase index fund weightage by 5% for better alpha.</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-zinc-900/30 border border-zinc-800 border-dashed rounded-3xl">
              <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mb-6">
                <Lightbulb className="w-10 h-10 text-white animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 italic">Ready for AI Wealth Management?</h3>
              <p className="text-zinc-400 max-w-sm mb-8">
                Enter your details to generate an AI-driven financial roadmap, health score, and risk profile.
              </p>
              <button 
                onClick={calculateResults}
                className="bg-white hover:bg-zinc-200 text-black font-semibold px-8 py-3 rounded-xl transition-all shadow-lg shadow-white/10"
              >
                Start AI Analysis
              </button>
            </div>
          )}
        </section>
      </main>

      <ChatBot context={{ healthScore, firePlan, taxData, inputs }} />
      
      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-20 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center text-sm text-zinc-500 gap-4">
        <p>© 2026 AI Money Mentor. Powered by Open Source Intelligence.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">Security</a>
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
