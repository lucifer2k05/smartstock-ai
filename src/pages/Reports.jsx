import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from "recharts";
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Layers,
  FileSpreadsheet,
} from "lucide-react";
import { useInventory } from "../context/InventoryContext";
import { HISTORICAL_SALES_TRENDS } from "../data/mockData";
import { StatCard } from "../components/common/StatCard";

export function Reports() {
  const { products, sales, settings, showToast } = useInventory();
  const [timeRange, setTimeRange] = useState("7d");

  const trendData = HISTORICAL_SALES_TRENDS[timeRange] || HISTORICAL_SALES_TRENDS["7d"];

  // Category breakdown calculation
  const categoryData = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      const val = p.sellingPrice * p.currentStock;
      map[p.category] = (map[p.category] || 0) + val;
    });

    return Object.keys(map).map((cat) => ({
      category: cat,
      inventoryValue: map[cat],
    }));
  }, [products]);

  // Fast-moving vs Slow-moving items
  const bestSellers = useMemo(() => {
    return [...products]
      .sort((a, b) => b.avgDailyDemand - a.avgDailyDemand)
      .slice(0, 5);
  }, [products]);

  const slowMovers = useMemo(() => {
    return [...products]
      .sort((a, b) => a.avgDailyDemand - b.avgDailyDemand)
      .slice(0, 5);
  }, [products]);

  // Client-side CSV Export
  const handleExportCSV = () => {
    const headers = [
      "Product Name",
      "SKU",
      "Category",
      "Selling Price",
      "Cost Price",
      "Current Stock",
      "Reorder Point",
      "Supplier",
      "Daily Demand Velocity",
    ];

    const rows = products.map((p) => [
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.sku}"`,
      `"${p.category}"`,
      p.sellingPrice,
      p.costPrice,
      p.currentStock,
      p.reorderPoint,
      `"${p.supplier || ""}"`,
      p.avgDailyDemand,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `SmartStock_Inventory_Report_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Inventory report downloaded as CSV file.");
  };

  const totalRevenue = trendData.reduce((acc, d) => acc + d.sales, 0);
  const totalOrders = trendData.reduce((acc, d) => acc + d.orders, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full w-fit mb-2 border border-teal-100">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Store Business Analytics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Reports & Store Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Evaluate financial returns, category capital allocation, and SKU movement velocity
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-900 bg-teal-400 hover:bg-teal-300 rounded-xl shadow-md shadow-teal-500/20 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Inventory CSV</span>
          </button>
        </div>
      </div>

      {/* Date Range Selector & KPI Highlights */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <span className="text-xs font-bold text-slate-700">Analytics Timeframe:</span>
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          {["7d", "14d", "30d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                timeRange === range
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {range === "7d" ? "Past 7 Days" : range === "14d" ? "Past 14 Days" : "Past 30 Days"}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Period Sales Turnover"
          value={`${settings.currency}${totalRevenue.toLocaleString()}`}
          subtitle={`Across ${timeRange} timeframe`}
          icon={DollarSign}
          accentColor="teal"
          trend="+12.4% vs prev"
          trendType="up"
        />

        <StatCard
          title="Customer Order Volume"
          value={`${totalOrders} receipts`}
          subtitle="Total store checkouts"
          icon={Package}
          accentColor="indigo"
          trend="+8 orders"
          trendType="up"
        />

        <StatCard
          title="Avg Transaction Value"
          value={`${settings.currency}${
            totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
          }`}
          subtitle="Average basket total"
          icon={Layers}
          accentColor="emerald"
          trend="Healthy basket"
          trendType="neutral"
        />

        <StatCard
          title="Estimated Gross Margin"
          value="26.4%"
          subtitle="Cost-of-goods markup"
          icon={TrendingUp}
          accentColor="amber"
          trend="Industry benchmark"
          trendType="neutral"
        />
      </div>

      {/* Chart 1: Revenue & Order Count Velocity */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Revenue & Order Volume Trend</h3>
            <p className="text-xs text-slate-500">Historical performance curve over {timeRange}</p>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                formatter={(val, name) => [
                  name === "Sales" ? `${settings.currency}${val}` : `${val} orders`,
                  name,
                ]}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderRadius: "12px",
                  border: "none",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                name="Sales"
                stroke="#0d9488"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                name="Orders"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Inventory Valuation by Category */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Inventory Value by Product Category
            </h3>
            <p className="text-xs text-slate-500">
              Total capital invested in on-hand inventory across departments
            </p>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="category"
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                angle={-15}
                textAnchor="end"
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `${settings.currency}${v}`}
              />
              <Tooltip
                formatter={(val) => [`${settings.currency}${val.toLocaleString()}`, "Valuation"]}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderRadius: "12px",
                  border: "none",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="inventoryValue" fill="#0d9488" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparative Velocity: Best-Selling vs Slow-Moving */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fast Moving */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">High-Velocity Products</h3>
              <p className="text-xs text-slate-500">Fastest turnover • Maintain buffer stock</p>
            </div>
          </div>

          <div className="space-y-3">
            {bestSellers.map((prod, idx) => (
              <div
                key={prod.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">{prod.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {prod.sku} • Stock: {prod.currentStock}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700">
                    {prod.avgDailyDemand} units/day
                  </span>
                  <p className="text-[10px] text-slate-400">
                    Est. {settings.currency}
                    {Math.round(prod.avgDailyDemand * 30 * prod.sellingPrice).toLocaleString()} /mo
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slow Moving */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Slow-Moving Inventory</h3>
              <p className="text-xs text-slate-500">Low turnover • Review order quantities</p>
            </div>
          </div>

          <div className="space-y-3">
            {slowMovers.map((prod, idx) => (
              <div
                key={prod.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">{prod.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {prod.sku} • Stock: {prod.currentStock}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-amber-700">
                    {prod.avgDailyDemand} units/day
                  </span>
                  <p className="text-[10px] text-slate-400">
                    {(prod.currentStock / (prod.avgDailyDemand || 1)).toFixed(0)} days of supply
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
