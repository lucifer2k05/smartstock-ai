import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Zap, AlertCircle } from "lucide-react";
import { AI_INSIGHTS_DATA } from "../../data/mockData";

export function AiInsightsCard() {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white p-5 lg:p-6 shadow-xl border border-slate-800 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-inner">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                AI Inventory Insights
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                Simulated AI Demo
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Pattern detection from sales velocity & procurement lead times
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/forecasts")}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-teal-500 text-slate-950 hover:bg-teal-400 transition cursor-pointer shadow-md shadow-teal-500/20"
        >
          <span>Open AI Forecast Studio</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Insights Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 relative z-10">
        {AI_INSIGHTS_DATA.map((insight) => (
          <div
            key={insight.id}
            className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-teal-500/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    insight.priority === "critical"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : insight.priority === "high"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                  }`}
                >
                  {insight.priority} alert
                </span>
                <span className="text-[10px] text-slate-400">{insight.confidence}</span>
              </div>

              <h4 className="text-xs font-bold text-slate-100 mb-1.5">{insight.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{insight.message}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/60">
              <p className="text-[11px] text-teal-300 font-medium flex items-start gap-1.5">
                <Zap className="w-3.5 h-3.5 shrink-0 mt-0.5 text-teal-400" />
                <span>{insight.actionRecommendation}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Hackathon Disclaimer Banner */}
      <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2 relative z-10">
        <p className="flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-teal-400" />
          <span>
            These insights are illustrative demo insights generated from mock sales velocity.
            Connect Dev's Python/Flask backend (`GET /api/forecast`) for real ML predictions.
          </span>
        </p>
        <span className="text-slate-500 font-mono text-[10px] shrink-0">Model: v1-simulated</span>
      </div>
    </div>
  );
}
