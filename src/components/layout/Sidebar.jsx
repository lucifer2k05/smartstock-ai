import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  RefreshCw,
  BarChart3,
  Settings,
  Sparkles,
  Store,
  RotateCcw,
  X,
  ExternalLink,
} from "lucide-react";
import { useInventory } from "../../context/InventoryContext";

export function Sidebar({ mobileOpen, setMobileOpen }) {
  const { metrics, settings, resetDemoData } = useInventory();

  const navItems = [
    { to: "/", label: "Overview", icon: LayoutDashboard },
    {
      to: "/inventory",
      label: "Inventory",
      icon: Package,
      badge: metrics.lowStockCount > 0 ? metrics.lowStockCount : null,
      badgeColor: "bg-amber-100 text-amber-800",
    },
    { to: "/sales", label: "Sales Management", icon: ShoppingCart },
    {
      to: "/forecasts",
      label: "AI Forecasts",
      icon: TrendingUp,
      badge: "AI",
      badgeColor: "bg-teal-100 text-teal-800",
    },
    {
      to: "/recommendations",
      label: "Reorder Advice",
      icon: RefreshCw,
      badge: metrics.lowStockCount > 0 ? "Action" : null,
      badgeColor: "bg-rose-100 text-rose-800",
    },
    { to: "/reports", label: "Reports & Analytics", icon: BarChart3 },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  const handleNavClick = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-teal-500/20">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-white tracking-tight">SmartStock</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                Inventory Intelligence
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Store Pill */}
        <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-950/40">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-800 text-xs">
            <Store className="w-4 h-4 text-teal-400 shrink-0" />
            <div className="truncate">
              <p className="font-medium text-slate-200 truncate">{settings.shopName}</p>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Store Online • Demo Mode
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Core Modules
          </div>

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-teal-500 text-slate-950 font-semibold shadow-sm shadow-teal-500/30"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? "text-slate-950" : "text-slate-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? "bg-slate-900 text-white" : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Quick Demo Controls */}
        <div className="p-3 mx-3 my-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-slate-300 text-[11px]">Hackathon Demo</span>
            <button
              onClick={resetDemoData}
              title="Reset mock catalog and transactions to defaults"
              className="flex items-center gap-1 text-[10px] text-teal-400 hover:text-teal-300 font-medium px-1.5 py-0.5 rounded hover:bg-teal-950/40 transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Data
            </button>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Transactions reduce stock & trigger automated notifications in real-time.
          </p>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-teal-300">
              {settings.ownerName ? settings.ownerName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "T"}
            </div>
            <div className="flex-1 truncate">
              <p className="text-xs font-semibold text-slate-200 truncate">{settings.ownerName}</p>
              <p className="text-[10px] text-slate-400">Shop Owner • Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
