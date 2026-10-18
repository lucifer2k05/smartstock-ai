import React from "react";
import { TrendingUp, Award } from "lucide-react";
import { useInventory } from "../../context/InventoryContext";

export function TopSellingList() {
  const { products, settings } = useInventory();

  // Top products ranked by demand velocity
  const topProducts = [...products]
    .sort((a, b) => b.avgDailyDemand - a.avgDailyDemand)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-teal-50 text-teal-600 border border-teal-200">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Top-Velocity SKUs</h3>
            <p className="text-xs text-slate-500">Fastest-moving items by daily sales</p>
          </div>
        </div>
        <span className="text-xs font-medium text-slate-400">Current Month</span>
      </div>

      <div className="space-y-3">
        {topProducts.map((prod, index) => {
          const simulatedUnitsSold = Math.round(prod.avgDailyDemand * 24);
          const simulatedRevenue = simulatedUnitsSold * prod.sellingPrice;

          return (
            <div
              key={prod.id}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : index === 1
                      ? "bg-slate-200 text-slate-800"
                      : index === 2
                      ? "bg-amber-50 text-amber-900 border border-amber-200"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  #{index + 1}
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-900">{prod.name}</p>
                  <p className="text-[10px] text-slate-500">{prod.category}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs font-bold text-slate-900">
                  {settings.currency}
                  {simulatedRevenue.toLocaleString()}
                </p>
                <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-600 font-medium">
                  <TrendingUp className="w-3 h-3" />
                  <span>{simulatedUnitsSold} sold ({prod.avgDailyDemand}/day)</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
