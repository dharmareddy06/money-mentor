import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Sparkles, 
  ArrowRight, 
  Lightbulb, 
  ShieldCheck, 
  TrendingDown, 
  Target, 
  Zap,
  AlertCircle
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

interface Insight {
  category: "Savings" | "Debt" | "Retirement" | "Strategy";
  insight: string;
  action: string;
  priority: "high" | "medium" | "low";
}

export default function AIInsights({ inputs }: { inputs: any }) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/ai-insights`, inputs);
      setInsights(res.data.insights);
    } catch (error) {
      console.error("Error fetching AI insights", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Only fetch if inputs have been initialized (e.g. income > 0)
    // and avoid hitting the API too aggressively while typing
    const timer = setTimeout(() => {
      if (inputs.income > 0) {
        fetchInsights();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputs]);

  const getIcon = (category: string) => {
    switch (category) {
      case 'Savings': return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'Debt': return <TrendingDown className="w-4 h-4 text-rose-400" />;
      case 'Retirement': return <Target className="w-4 h-4 text-indigo-400" />;
      case 'Strategy': return <Zap className="w-4 h-4 text-amber-400" />;
      default: return <Lightbulb className="w-4 h-4 text-blue-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-white/20 text-white border-white/30';
      case 'medium': return 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30';
      case 'low': return 'bg-zinc-800/50 text-zinc-400 border-zinc-700/30';
      default: return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl backdrop-blur-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
        <Sparkles className="w-12 h-12 text-white" />
      </div>
      
      <h3 className="text-white font-semibold flex items-center gap-2 mb-6">
        <AlertCircle className="w-5 h-5 text-zinc-400" />
        AI Proactive Insights
      </h3>

      <div className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-zinc-800/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          insights.map((item, idx) => (
            <div key={idx} className="p-4 bg-zinc-800/30 rounded-2xl border border-zinc-700/50 hover:bg-zinc-800/50 transition-all group/item">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-zinc-800 rounded-lg border border-zinc-700">
                    {getIcon(item.category)}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">{item.category}</span>
                </div>
                <span className={`text-[8px] uppercase px-2 py-0.5 rounded-full border font-bold ${getPriorityColor(item.priority)}`}>
                  {item.priority}
                </span>
              </div>
              <p className="text-sm text-zinc-200 mb-2 leading-relaxed italic">"{item.insight}"</p>
              <div className="flex items-center gap-1.5 text-xs text-white font-medium opacity-0 group-hover/item:opacity-100 transition-opacity">
                <ArrowRight className="w-3 h-3" />
                Next Step: {item.action}
              </div>
            </div>
          ))
        )}
      </div>

      <button 
        onClick={fetchInsights}
        className="mt-6 w-full py-2 text-xs text-zinc-500 hover:text-white border border-transparent hover:border-zinc-500/30 rounded-xl transition-all flex items-center justify-center gap-1 bg-zinc-800/30"
      >
        Refresh Analysis <Sparkles className="w-3 h-3" />
      </button>
    </div>
  );
}
