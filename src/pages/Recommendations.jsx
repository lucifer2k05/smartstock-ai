import React, { useState, useMemo } from "react";
import {
  RefreshCw,
  Calculator,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Send,
  Sparkles,
  Info,
} from "lucide-react";
import { useInventory } from "../context/InventoryContext";
import { Badge } from "../components/common/Badge";

export function Recommendations() {
  const { products, settings, showToast } = useInventory();
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [reviewedItems, setReviewedItems] = useState({});

  // Compute reorder advice based on baseline inventory equations
  const recommendations = useMemo(() => {
    return products.map((prod) => {
      const calculatedROP = Math.round(
        prod.avgDailyDemand * prod.leadTimeDays + prod.safetyStock
      );
      const suggestedQty = Math.max(0, prod.targetStock - prod.currentStock);

      let priority = "Normal";
      let priorityBadgeVariant = "inStock";
      let explanation = `Stock (${prod.currentStock}) is above reorder point (${calculatedROP}). Sufficient safety buffer for ~${Math.round(
        prod.currentStock / prod.avgDailyDemand
      )} days.`;

      if (prod.currentStock === 0) {
        priority = "Critical";
        priorityBadgeVariant = "outOfStock";
        explanation = `Immediate Stockout! 0 units remaining. Customers cannot purchase. Expedite emergency purchase order with ${prod.supplier}.`;
      } else if (prod.currentStock <= prod.safetyStock) {
        priority = "High Urgency";
        priorityBadgeVariant = "lowStock";
        explanation = `Safety stock breached! Current stock (${prod.currentStock}) is below minimum buffer (${prod.safetyStock}). Expected stockout in < ${Math.round(
          prod.currentStock / prod.avgDailyDemand
        )} days.`;
      } else if (prod.currentStock <= calculatedROP) {
        priority = "Moderate";
        priorityBadgeVariant = "default";
        explanation = `Reorder point reached (${prod.currentStock} <= ${calculatedROP}). Lead time is ${prod.leadTimeDays} days. Order now to prevent depletion.`;
      }

      return {
        ...prod,
        calculatedROP,
        suggestedQty,
        priority,
        priorityBadgeVariant,
        explanation,
        estimatedCost: suggestedQty * prod.costPrice,
      };
    });
  }, [products]);

  // Filter recommendations
  const filteredRecommendations = useMemo(() => {
    if (priorityFilter === "All") return recommendations;
    if (priorityFilter === "Actionable")
      return recommendations.filter((r) => r.priority !== "Normal");
    return recommendations.filter((r) => r.priority === priorityFilter);
  }, [recommendations, priorityFilter]);

  const handleMarkReviewed = (id, name) => {
    setReviewedItems((prev) => ({ ...prev, [id]: true }));
    showToast(`Marked recommendation for "${name}" as reviewed.`);
  };

  const handleCreatePO = (item) => {
    showToast(
      `Purchase order of ${item.suggestedQty} units created for ${item.supplier} (${settings.currency}${item.estimatedCost.toLocaleString()}).`
    );
  };

  const actionableCount = recommendations.filter((r) => r.priority !== "Normal").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full w-fit mb-2 border border-teal-100">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Algorithmic Procurement Advisor</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Reorder Recommendations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Transparent safety-stock replenishment calculations based on lead times and sales velocity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl">
            {actionableCount} Items Need Action
          </span>
        </div>
      </div>

      {/* Transparent Baseline Formula Banner */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="w-5 h-5 text-teal-400" />
          <h3 className="text-sm font-bold text-teal-300 uppercase tracking-wider">
            Deterministic Inventory Replenishment Formulas
          </h3>
        </div>

        <p className="text-xs text-slate-300 mb-4">
          SmartStock AI uses a transparent 2-stage inventory optimization formula. Once Dev connects the
          machine-learning pipeline, dynamic lead-time volatility and seasonality weights will be layered in.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700/80">
            <span className="text-[10px] text-teal-400 font-sans uppercase font-bold block mb-1">
              1. Reorder Point (ROP) Formula
            </span>
            <code className="text-emerald-300 font-bold block">
              ROP = (Daily Demand × Lead Time) + Safety Stock
            </code>
            <p className="text-[11px] text-slate-400 font-sans mt-1">
              Determines the exact stock trigger when a purchase order must be placed.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700/80">
            <span className="text-[10px] text-teal-400 font-sans uppercase font-bold block mb-1">
              2. Suggested Order Quantity Formula
            </span>
            <code className="text-teal-300 font-bold block">
              Quantity = max(0, Target Stock − Current Stock)
            </code>
            <p className="text-[11px] text-slate-400 font-sans mt-1">
              Restores optimal store inventory without tying up unnecessary working capital.
            </p>
          </div>
        </div>
      </div>

      {/* Priority Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {["All", "Actionable", "Critical", "High Urgency", "Moderate", "Normal"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setPriorityFilter(tab)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition cursor-pointer ${
                  priorityFilter === tab
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        <span className="text-xs text-slate-400">
          Showing {filteredRecommendations.length} SKU recommendations
        </span>
      </div>

      {/* Recommendations Cards / Table */}
      <div className="space-y-4">
        {filteredRecommendations.map((item) => {
          const isReviewed = reviewedItems[item.id];

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all ${
                item.priority === "Critical"
                  ? "bg-rose-50/30 border-rose-200"
                  : item.priority === "High Urgency"
                  ? "bg-amber-50/20 border-amber-200"
                  : "bg-white border-slate-200/80"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Product Info */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{item.name}</h3>
                    <Badge variant={item.priorityBadgeVariant}>
                      {item.priority} Priority
                    </Badge>
                    {isReviewed && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Reviewed
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-mono">
                    SKU: {item.sku} • Category: {item.category} • Supplier:{" "}
                    <strong>{item.supplier}</strong>
                  </p>
                </div>

                {/* Quick Recommendation Action */}
                <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
                  <button
                    onClick={() => handleMarkReviewed(item.id, item.name)}
                    disabled={isReviewed}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isReviewed ? "Reviewed" : "Mark Reviewed"}
                  </button>

                  <button
                    onClick={() => handleCreatePO(item)}
                    disabled={item.suggestedQty === 0}
                    className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl shadow-md shadow-teal-500/20 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Create Purchase Order ({item.suggestedQty} Units)</span>
                  </button>
                </div>
              </div>

              {/* Formula Metrics Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    Current Stock
                  </span>
                  <span
                    className={`font-black text-sm ${
                      item.currentStock === 0
                        ? "text-rose-600"
                        : item.currentStock <= item.reorderPoint
                        ? "text-amber-600"
                        : "text-slate-900"
                    }`}
                  >
                    {item.currentStock} units
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    Daily Demand
                  </span>
                  <span className="font-bold text-sm text-slate-800">
                    {item.avgDailyDemand}/day
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    Supplier Lead Time
                  </span>
                  <span className="font-bold text-sm text-slate-800">
                    {item.leadTimeDays} days
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    Safety Stock Buffer
                  </span>
                  <span className="font-bold text-sm text-slate-800">
                    {item.safetyStock} units
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    Calculated ROP
                  </span>
                  <span className="font-black text-sm text-indigo-600">
                    {item.calculatedROP} units
                  </span>
                </div>

                <div className="bg-teal-50 p-2.5 rounded-xl border border-teal-100">
                  <span className="text-[10px] text-teal-700 block font-bold">
                    Suggested Order
                  </span>
                  <span className="font-black text-sm text-teal-900">
                    {item.suggestedQty} units (
                    {settings.currency}
                    {item.estimatedCost.toLocaleString()})
                  </span>
                </div>
              </div>

              {/* Plain-English Explanation */}
              <div className="mt-3 text-xs text-slate-600 flex items-start gap-2 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p>{item.explanation}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
