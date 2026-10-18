import React, { useState } from "react";
import {
  Store,
  User,
  Bell,
  Monitor,
  Shield,
  Save,
  RotateCcw,
  Sparkles,
  Users,
  CheckCircle2,
} from "lucide-react";
import { useInventory } from "../context/InventoryContext";

export function Settings() {
  const { settings, updateSettings, resetDemoData } = useInventory();

  const [formData, setFormData] = useState({ ...settings });
  const [activeTab, setActiveTab] = useState("store"); // store, profile, notifications, display, team

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(formData);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Settings & Store Configuration
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure store metadata, currency, threshold alert preferences, and team roles
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetDemoData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs">
        {[
          { id: "store", label: "Shop Information", icon: Store },
          { id: "profile", label: "Owner Profile", icon: User },
          { id: "notifications", label: "Notification Rules", icon: Bell },
          { id: "display", label: "Display & Metrics", icon: Monitor },
          { id: "team", label: "Team & Security", icon: Shield },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: Shop Information */}
        {activeTab === "store" && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Store Identity & Regional Format
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Retail Store Name
                </label>
                <input
                  type="text"
                  value={formData.shopName}
                  onChange={(e) => handleChange("shopName", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Currency Symbol
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleChange("currency", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-hidden bg-white"
                >
                  <option value="₹">₹ (INR - Indian Rupee)</option>
                  <option value="$">$ (USD - US Dollar)</option>
                  <option value="€">€ (EUR - Euro)</option>
                  <option value="£">£ (GBP - British Pound)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Store Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Default GST / Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={formData.taxRate}
                  onChange={(e) => handleChange("taxRate", Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Owner Profile */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Store Owner & Administrator Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => handleChange("ownerName", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Notifications */}
        {activeTab === "notifications" && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Automated Alert Dispatch Preferences
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Instant Low-Stock Notifications
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Trigger in-app notification when stock level reaches or drops below Reorder Point
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.lowStockAlertEmail}
                  onChange={(e) => handleChange("lowStockAlertEmail", e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-slate-900">Daily Morning Stock Digest</p>
                  <p className="text-[11px] text-slate-500">
                    Prepare a summary of overnight stock shifts and recommended orders at 08:00 AM
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.dailyMorningDigest}
                  onChange={(e) => handleChange("dailyMorningDigest", e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-slate-900">Audible POS Checkout Sounds</p>
                  <p className="text-[11px] text-slate-500">
                    Play confirmation chime when a customer sale transaction is recorded
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.soundAlerts}
                  onChange={(e) => handleChange("soundAlerts", e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}

        {/* TAB 4: Display & Metrics */}
        {activeTab === "display" && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              UI Density & Default Horizons
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Default Forecast Horizon
                </label>
                <select
                  value={formData.defaultHorizon}
                  onChange={(e) => handleChange("defaultHorizon", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-hidden bg-white"
                >
                  <option value="7d">7 Days (Short-term velocity)</option>
                  <option value="14d">14 Days (Standard bi-weekly)</option>
                  <option value="30d">30 Days (Monthly cycle)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Table Layout Density
                </label>
                <select
                  value={formData.compactView ? "compact" : "comfortable"}
                  onChange={(e) => handleChange("compactView", e.target.value === "compact")}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-hidden bg-white"
                >
                  <option value="comfortable">Comfortable Spacing</option>
                  <option value="compact">Compact (High Information Density)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Team & Security Placeholder (Dhruv & Backend Team) */}
        {activeTab === "team" && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Shield className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Hackathon Team Allocation & Security Architecture
                </h3>
                <p className="text-xs text-slate-500">
                  Role responsibilities for upcoming Python/Flask and Cloud deployment
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-teal-600 uppercase">
                  Frontend Development
                </span>
                <p className="text-xs font-bold text-slate-900 mt-1">
                  {settings.team.frontend}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Complete React + Vite + Tailwind + Recharts UI & mock API service layer
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-indigo-600 uppercase">
                  AI & Demand Forecasting
                </span>
                <p className="text-xs font-bold text-slate-900 mt-1">
                  {settings.team.aiBackend}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Python demand forecasting models & future <code className="font-mono">/api/forecast</code>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-emerald-600 uppercase">
                  Database & API Logic
                </span>
                <p className="text-xs font-bold text-slate-900 mt-1">
                  {settings.team.dbBackend}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  PostgreSQL database schema, products & sales CRUD API logic
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-rose-600 uppercase">
                  Cloud & CyberSecurity
                </span>
                <p className="text-xs font-bold text-slate-900 mt-1">
                  {settings.team.cloudSec}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Cloud hosting, HTTPS TLS certificates, role-based access control & backup routines
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-800">
              <strong>Security Placeholder:</strong> 2-Factor Authentication (2FA) and JWT Bearer Tokens
              will be connected to Dhruv's secure authentication server during final backend integration.
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl shadow-md shadow-teal-500/20 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
