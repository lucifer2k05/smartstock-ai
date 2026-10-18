import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useInventory } from "../../context/InventoryContext";

export function StockDistributionChart() {
  const { metrics } = useInventory();

  const data = [
    { name: "In Stock", value: metrics.inStockCount, color: "#10b981" },
    { name: "Low Stock", value: metrics.lowStockCount - metrics.outOfStockCount, color: "#f59e0b" },
    { name: "Out of Stock", value: metrics.outOfStockCount, color: "#f43f5e" },
  ].filter((item) => item.value > 0);

  const total = metrics.totalProducts || 1;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const pct = Math.round((item.value / total) * 100);
      return (
        <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-lg border border-slate-800">
          <p className="font-semibold" style={{ color: item.payload.color }}>
            {item.name}: {item.value} SKUs ({pct}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-slate-900">Inventory Health</h3>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {total} Total SKUs
          </span>
        </div>
        <p className="text-xs text-slate-500">Live breakdown by replenishment risk</p>
      </div>

      <div className="h-52 w-full relative flex items-center justify-center my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={84}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Metric Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-slate-900">
            {Math.round((metrics.inStockCount / total) * 100)}%
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Stocked
          </span>
        </div>
      </div>

      <div className="space-y-2 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600">Healthy Stock</span>
          </div>
          <span className="font-bold text-slate-900">
            {metrics.inStockCount} <span className="text-slate-400 font-normal">({Math.round((metrics.inStockCount / total) * 100)}%)</span>
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-slate-600">Low Stock Buffer</span>
          </div>
          <span className="font-bold text-amber-700">
            {metrics.lowStockCount - metrics.outOfStockCount} <span className="text-slate-400 font-normal">({Math.round(((metrics.lowStockCount - metrics.outOfStockCount) / total) * 100)}%)</span>
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-slate-600">Stockouts</span>
          </div>
          <span className="font-bold text-rose-700">
            {metrics.outOfStockCount} <span className="text-slate-400 font-normal">({Math.round((metrics.outOfStockCount / total) * 100)}%)</span>
          </span>
        </div>
      </div>
    </div>
  );
}
