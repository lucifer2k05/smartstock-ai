import React, { useState, useMemo } from "react";
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  CreditCard,
  Banknote,
  Smartphone,
  Calendar,
  CheckCircle2,
  Receipt,
  ArrowUpDown,
} from "lucide-react";
import { useInventory } from "../context/InventoryContext";
import { RecordSaleModal } from "../components/sales/RecordSaleModal";
import { StatCard } from "../components/common/StatCard";

export function Sales() {
  const { sales, settings } = useInventory();
  const [isRecordSaleOpen, setIsRecordSaleOpen] = useState(false);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("All");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("All");

  // Filter sales
  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      const matchesSearch =
        s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.items.some((item) =>
          item.productName.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        s.customerType?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPayment =
        selectedPayment === "All" || s.paymentMethod === selectedPayment;

      let matchesPeriod = true;
      if (selectedTimePeriod === "Today") {
        matchesPeriod = s.timestamp.startsWith("2026-10-18");
      } else if (selectedTimePeriod === "Yesterday") {
        matchesPeriod = s.timestamp.startsWith("2026-10-17");
      }

      return matchesSearch && matchesPayment && matchesPeriod;
    });
  }, [sales, searchTerm, selectedPayment, selectedTimePeriod]);

  // Aggregate metrics
  const totalSalesRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalUnitsSold = sales.reduce((acc, s) => acc + s.totalQuantity, 0);
  const totalTransactions = sales.length;
  const avgBasketValue = totalTransactions > 0 ? Math.round(totalSalesRevenue / totalTransactions) : 0;

  const paymentMethodIcons = {
    UPI: <Smartphone className="w-3.5 h-3.5 text-teal-600" />,
    Cash: <Banknote className="w-3.5 h-3.5 text-emerald-600" />,
    Card: <CreditCard className="w-3.5 h-3.5 text-indigo-600" />,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Sales & Order Transactions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Log point-of-sale customer checkouts with automatic inventory stock deductions
          </p>
        </div>

        <button
          onClick={() => setIsRecordSaleOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl shadow-md shadow-teal-500/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Sale (POS)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Gross Revenue"
          value={`${settings.currency}${totalSalesRevenue.toLocaleString()}`}
          subtitle="All recorded sales"
          icon={Receipt}
          accentColor="teal"
          trend="+18.4% month"
          trendType="up"
        />

        <StatCard
          title="Total Transactions"
          value={totalTransactions}
          subtitle="Customer receipts"
          icon={ShoppingCart}
          accentColor="indigo"
          trend="Active store"
          trendType="neutral"
        />

        <StatCard
          title="Total Units Sold"
          value={`${totalUnitsSold} items`}
          subtitle="Inventory depleted"
          icon={CheckCircle2}
          accentColor="emerald"
          trend="High volume"
          trendType="up"
        />

        <StatCard
          title="Average Order Value"
          value={`${settings.currency}${avgBasketValue}`}
          subtitle="Per checkout transaction"
          icon={CreditCard}
          accentColor="amber"
          trend="+5.2% basket size"
          trendType="up"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search receipt ID, product name, customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-hidden"
            />
          </div>

          {/* Payment Method Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 shrink-0">Payment:</span>
            <select
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-hidden"
            >
              <option value="All">All Methods (UPI, Cash, Card)</option>
              <option value="UPI">UPI Digital Payment</option>
              <option value="Cash">Cash at Counter</option>
              <option value="Card">Credit / Debit Card</option>
            </select>
          </div>

          {/* Time Filter */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedTimePeriod}
              onChange={(e) => setSelectedTimePeriod(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-hidden"
            >
              <option value="All">All Historical Transactions</option>
              <option value="Today">Today (Simulated Oct 18)</option>
              <option value="Yesterday">Yesterday (Simulated Oct 17)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Displaying <strong className="text-slate-800">{filteredSales.length}</strong> of{" "}
            {sales.length} orders
          </span>

          {(searchTerm || selectedPayment !== "All" || selectedTimePeriod !== "All") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedPayment("All");
                setSelectedTimePeriod("All");
              }}
              className="text-teal-600 hover:text-teal-700 font-semibold cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Sales Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Receipt / ID</th>
                <th className="py-3.5 px-3">Date & Timestamp</th>
                <th className="py-3.5 px-4">Items Sold</th>
                <th className="py-3.5 px-3 text-center">Total Quantity</th>
                <th className="py-3.5 px-3">Payment</th>
                <th className="py-3.5 px-3 text-right">Total Amount</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold">No sales transactions found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Click "+ Record New Sale" to log a customer checkout.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => {
                  const dateObj = new Date(sale.timestamp);
                  const formattedDate = dateObj.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* ID & Customer */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {sale.id}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {sale.customerType || "Walk-in Regular"}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-3 text-slate-600 font-medium whitespace-nowrap">
                        {formattedDate}
                      </td>

                      {/* Items Details */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-1">
                          {sale.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="text-[11px] text-slate-700 flex items-center justify-between gap-2"
                            >
                              <span className="truncate">• {item.productName}</span>
                              <span className="text-slate-400 font-mono shrink-0">
                                {item.quantity} × {settings.currency}{item.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Total Quantity */}
                      <td className="py-3.5 px-3 text-center">
                        <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full">
                          {sale.totalQuantity}
                        </span>
                      </td>

                      {/* Payment Method */}
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {paymentMethodIcons[sale.paymentMethod]}
                          <span>{sale.paymentMethod}</span>
                        </span>
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 px-3 text-right">
                        <span className="text-sm font-black text-slate-900">
                          {settings.currency}{sale.totalAmount.toLocaleString()}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>{sale.status || "Completed"}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Sale Modal */}
      <RecordSaleModal
        isOpen={isRecordSaleOpen}
        onClose={() => setIsRecordSaleOpen(false)}
      />
    </div>
  );
}
