import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import {
  Sparkles,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useInventory } from "../context/InventoryContext";
import { DEMO_FORECAST_MODELS } from "../data/mockData";
import { StatCard } from "../components/common/StatCard";

export function Forecasts() {
  const { products } = useInventory();

  // Selected product and forecast horizon
  const [selectedProductId, setSelectedProductId] = useState("prod-1");
  const [horizon, setHorizon] = useState("7d"); // 7d, 14d, 30d

  // Get forecast model or synthesize deterministic data for selected product
  const activeProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const forecastData = useMemo(() => {
    // If we have custom mock curves for this product
    if (DEMO_FORECAST_MODELS[selectedProductId]) {
      const model = DEMO_FORECAST_MODELS[selectedProductId];
      // Combine history and future predictions for continuous chart
      const chartSeries = [
        ...model.history.map((h) => ({
          name: h.day,
          historical: h.actual,
          forecast: null,
          confidenceUpper: null,
          confidenceLower: null,
        })),
        // Overlap point on Today
        {
          name: "Today",
          historical: model.history[model.history.length - 1].actual,
          forecast: model.history[model.history.length - 1].actual,
          confidenceUpper: model.history[model.history.length - 1].actual,
          confidenceLower: model.history[model.history.length - 1].actual,
        },
        ...model.predictions7d.map((p) => ({
          name: p.day,
          historical: null,
          forecast: p.forecast,
          confidenceUpper: p.confidenceUpper,
          confidenceLower: p.confidenceLower,
        })),
      ];

      return {
        chartSeries,
        predictedTotal: model.predictedTotal,
        avgDailyPredicted: model.avgDailyPredicted,
        trendDirection: model.trendDirection,
        seasonalityPattern: model.seasonalityPattern,
        aiExplanation: model.aiExplanation,
      };
    }

    // Deterministic fallback for any added products
    const baseline = activeProduct.avgDailyDemand || 6;
    const history = [
      { name: "Day -4", historical: Math.round(baseline * 0.9), forecast: null },
      { name: "Day -3", historical: Math.round(baseline * 1.1), forecast: null },
      { name: "Day -2", historical: Math.round(baseline * 1.0), forecast: null },
      { name: "Day -1", historical: Math.round(baseline * 1.2), forecast: null },
      { name: "Today", historical: Math.round(baseline), forecast: Math.round(baseline) },
      { name: "+1 Day", historical: null, forecast: Math.round(baseline * 1.05) },
      { name: "+2 Day", historical: null, forecast: Math.round(baseline * 1.15) },
      { name: "+3 Day", historical: null, forecast: Math.round(baseline * 1.25) },
      { name: "+4 Day", historical: null, forecast: Math.round(baseline * 1.1) },
      { name: "+5 Day", historical: null, forecast: Math.round(baseline * 1.0) },
      { name: "+6 Day", historical: null, forecast: Math.round(baseline * 1.1) },
      { name: "+7 Day", historical: null, forecast: Math.round(baseline * 1.2) },
    ];

    return {
      chartSeries: history,
      predictedTotal: Math.round(baseline * 7 * 1.12),
      avgDailyPredicted: Number((baseline * 1.12).toFixed(1)),
      trendDirection: "Projected Moderate Increase (+12%)",
      seasonalityPattern: "Weekly baseline rhythm",
      aiExplanation: `Based on your recent sales trajectory and safety stock buffer, demand for ${activeProduct.name} is anticipated to remain steady with an estimated 10-15% peak during typical replenishment cycles.`,
    };
  }, [selectedProductId, activeProduct]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-800">
          <p className="font-bold text-slate-300 mb-1">{label}</p>
          {payload.map((entry, idx) => (
            <p
              key={idx}
              className="flex items-center justify-between gap-4 font-semibold"
              style={{ color: entry.color }}
            >
              <span>{entry.name}:</span>
              <span>{entry.value !== null ? `${entry.value} units` : "—"}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full w-fit mb-2 border border-teal-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SmartStock AI • Predictive Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            AI Demand Forecasts
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Machine learning projections of customer buying patterns to prevent stockouts
          </p>
        </div>

        {/* Product Selector Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <label className="text-xs font-semibold text-slate-500 shrink-0">
            Select SKU:
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-900 shadow-xs focus:border-teal-500 focus:outline-hidden"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Horizon Filter & Model Header */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
              Active SKU Target
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
              {activeProduct.name}
            </h3>
            <p className="text-xs text-slate-400">
              Category: {activeProduct.category} • Supplier: {activeProduct.supplier}
            </p>
          </div>

          {/* Forecast Horizon Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl self-start sm:self-auto border border-slate-700">
            {["7d", "14d", "30d"].map((h) => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  horizon === h
                    ? "bg-teal-500 text-slate-950 font-bold shadow-xs"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {h === "7d" ? "Next 7 Days" : h === "14d" ? "14-Day Horizon" : "30 Days"}
              </button>
            ))}
          </div>
        </div>

        {/* Architecture Note */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-teal-400 shrink-0" />
          <span>
            Deterministic mock forecast values ready for Dev's Flask model integration (
            <code className="text-teal-300 font-mono">GET /api/forecast/:id</code>).
          </span>
        </div>
      </div>

      {/* KPI Cards for the Selected Product */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Predicted Demand"
          value={`${forecastData.predictedTotal} units`}
          subtitle={`Over the next ${horizon === "7d" ? "7 days" : "horizon"}`}
          icon={TrendingUp}
          accentColor="teal"
          trend={forecastData.trendDirection}
          trendType="up"
        />

        <StatCard
          title="Avg Daily Demand"
          value={`${forecastData.avgDailyPredicted} / day`}
          subtitle={`Current baseline: ${activeProduct.avgDailyDemand}/day`}
          icon={Calendar}
          accentColor="indigo"
          trend="Accelerating"
          trendType="up"
        />

        <StatCard
          title="Current Stock On-Hand"
          value={`${activeProduct.currentStock} units`}
          subtitle={`Reorder threshold: ${activeProduct.reorderPoint}`}
          icon={Layers}
          accentColor={activeProduct.currentStock <= activeProduct.reorderPoint ? "rose" : "emerald"}
          trend={
            activeProduct.currentStock <= activeProduct.reorderPoint
              ? "Reorder urgent"
              : "Sufficient buffer"
          }
          trendType={activeProduct.currentStock <= activeProduct.reorderPoint ? "down" : "neutral"}
        />

        <StatCard
          title="Projected Days of Supply"
          value={`${
            forecastData.avgDailyPredicted > 0
              ? (activeProduct.currentStock / forecastData.avgDailyPredicted).toFixed(1)
              : "0"
          } days`}
          subtitle="Until stock exhaustion"
          icon={Clock}
          accentColor={
            activeProduct.currentStock / forecastData.avgDailyPredicted < 3 ? "rose" : "amber"
          }
          trend={
            activeProduct.currentStock / forecastData.avgDailyPredicted < 3
              ? "< 72 hrs left"
              : "Safe timeline"
          }
          trendType={
            activeProduct.currentStock / forecastData.avgDailyPredicted < 3 ? "down" : "up"
          }
        />
      </div>

      {/* Historical vs Predicted Forecast Chart */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Demand Curve: Historical Sales vs. AI Prediction
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                Confidence Band: 90%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Solid line depicts verified store orders; dashed line depicts forward-looking AI model
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <span className="w-3 h-1 bg-slate-600 inline-block rounded"></span>
              Historical Actuals
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-teal-600">
              <span className="w-3 h-1 border-b-2 border-dashed border-teal-600 inline-block"></span>
              AI Forecast
            </span>
          </div>
        </div>

        <div className="h-72 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={forecastData.chartSeries}
              margin={{ top: 15, right: 15, left: -15, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
                label={{
                  value: "Units",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#94a3b8",
                  fontSize: 10,
                  offset: 20,
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                x="Today"
                stroke="#0d9488"
                strokeDasharray="4 4"
                label={{
                  value: "Today (Split)",
                  position: "top",
                  fill: "#0d9488",
                  fontSize: 10,
                  fontWeight: "bold",
                }}
              />
              <Line
                type="monotone"
                dataKey="historical"
                name="Historical Sales"
                stroke="#334155"
                strokeWidth={3}
                dot={{ r: 4, fill: "#334155" }}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                name="Predicted Demand"
                stroke="#0d9488"
                strokeWidth={3}
                strokeDasharray="6 6"
                dot={{ r: 4, fill: "#0d9488" }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Plain-English AI Explanation Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 sm:p-6 rounded-2xl border border-slate-700/80 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-teal-400" />
          <h4 className="text-sm font-bold text-teal-300 uppercase tracking-wider">
            Explainable AI (XAI) Rationalization
          </h4>
        </div>

        <p className="text-sm text-slate-200 leading-relaxed">
          {forecastData.aiExplanation}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-700/70 text-xs">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Seasonality Pattern
            </span>
            <p className="font-semibold text-slate-100 mt-0.5">
              {forecastData.seasonalityPattern}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Procurement Recommendation
            </span>
            <p className="font-semibold text-teal-300 mt-0.5">
              Place order {activeProduct.leadTimeDays} days before inventory drops below{" "}
              {activeProduct.reorderPoint} units.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
