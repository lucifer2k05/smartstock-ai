import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";
import { useInventory } from "../../context/InventoryContext";
import { StockStatusBadge } from "../common/Badge";

export function LowStockList() {
  const { products } = useInventory();
  const navigate = useNavigate();

  // Find products where currentStock <= reorderPoint, sorted by urgency (lowest stock first)
  const lowStockItems = products
    .filter((p) => p.currentStock <= p.reorderPoint)
    .sort((a, b) => a.currentStock - b.currentStock)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Urgent Low-Stock Alerts</h3>
            <p className="text-xs text-slate-500">Products requiring replenishment immediately</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/inventory")}
          className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {lowStockItems.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-sm font-semibold text-emerald-700">All Stock Levels Healthy!</p>
          <p className="text-xs text-slate-500 mt-1">
            No SKUs are currently below their reorder threshold.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 pl-1">Product</th>
                <th className="pb-3 text-center">Stock / ROP</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 text-right pr-1">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lowStockItems.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 pl-1">
                    <p className="font-semibold text-slate-900">{prod.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {prod.sku} • {prod.category}
                    </p>
                  </td>

                  <td className="py-3 text-center">
                    <span className="font-bold text-slate-900">{prod.currentStock}</span>
                    <span className="text-slate-400"> / {prod.reorderPoint} min</span>
                  </td>

                  <td className="py-3 text-center">
                    <StockStatusBadge
                      currentStock={prod.currentStock}
                      reorderPoint={prod.reorderPoint}
                    />
                  </td>

                  <td className="py-3 text-right pr-1">
                    <button
                      onClick={() => navigate("/recommendations")}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Reorder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
