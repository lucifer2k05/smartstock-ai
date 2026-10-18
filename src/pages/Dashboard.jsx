import React, { useState } from "react";
import {
  Package,
  IndianRupee,
  AlertTriangle,
  ShoppingBag,
  Plus,
  ShoppingCart,
  Calendar,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { useInventory } from "../context/InventoryContext";
import { StatCard } from "../components/common/StatCard";
import { SalesChart } from "../components/dashboard/SalesChart";
import { StockDistributionChart } from "../components/dashboard/StockDistributionChart";
import { LowStockList } from "../components/dashboard/LowStockList";
import { TopSellingList } from "../components/dashboard/TopSellingList";
import { AiInsightsCard } from "../components/dashboard/AiInsightsCard";
import { AddProductModal } from "../components/inventory/AddProductModal";
import { RecordSaleModal } from "../components/sales/RecordSaleModal";

export function Dashboard() {
  const { metrics, sales, settings } = useInventory();
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isRecordSaleOpen, setIsRecordSaleOpen] = useState(false);

  // Calculate today's sales
  const todayStr = "2026-10-18"; // Simulated current date
  const todaySalesAmount = sales
    .filter((s) => s.timestamp.startsWith(todayStr))
    .reduce((acc, s) => acc + s.totalAmount, 0);

  // Formatted date string
  const currentDateFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full w-fit mb-2 border border-teal-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Store Intelligence • Active</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Good morning, {settings.ownerName.split(" ")[0]}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Here is what's happening with your inventory and daily sales velocity today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentDateFormatted}</span>
          </div>

          <button
            onClick={() => setIsRecordSaleOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-900 bg-teal-400 hover:bg-teal-300 rounded-xl shadow-md shadow-teal-500/20 transition cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Record Sale</span>
          </button>

          <button
            onClick={() => setIsAddProductOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer border border-slate-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Products"
          value={metrics.totalProducts}
          subtitle="Catalog SKUs tracked"
          icon={Package}
          accentColor="indigo"
          trend="+3 added"
          trendType="neutral"
        />

        <StatCard
          title="Total Inventory Value"
          value={`${settings.currency}${metrics.totalInventoryValue.toLocaleString()}`}
          subtitle="At retail selling valuation"
          icon={IndianRupee}
          accentColor="teal"
          trend="+8.2% vs last wk"
          trendType="up"
        />

        <StatCard
          title="Low Stock Alerts"
          value={metrics.lowStockCount}
          subtitle={
            metrics.lowStockCount > 0
              ? `${metrics.outOfStockCount} critical stockouts`
              : "All buffers healthy"
          }
          icon={AlertTriangle}
          accentColor={metrics.lowStockCount > 0 ? "rose" : "emerald"}
          trend={metrics.lowStockCount > 3 ? "Replenish now" : "Controlled"}
          trendType={metrics.lowStockCount > 3 ? "down" : "neutral"}
        />

        <StatCard
          title="Today's Sales Revenue"
          value={`${settings.currency}${todaySalesAmount.toLocaleString()}`}
          subtitle="Simulated today's takings"
          icon={ShoppingBag}
          accentColor="emerald"
          trend="+14.5% vs yesterday"
          trendType="up"
        />
      </div>

      {/* AI Insights Distinctive Banner */}
      <AiInsightsCard />

      {/* Charts Section: Sales Area Chart & Donut Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <StockDistributionChart />
        </div>
      </div>

      {/* Tables Section: Low Stock & Top Selling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LowStockList />
        <TopSellingList />
      </div>

      {/* Modals */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
      />
      <RecordSaleModal
        isOpen={isRecordSaleOpen}
        onClose={() => setIsRecordSaleOpen(false)}
      />
    </div>
  );
}
