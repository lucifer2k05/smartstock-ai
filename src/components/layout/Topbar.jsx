import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  Menu,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
  ChevronDown,
  Store,
  User,
  Shield,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useInventory } from "../../context/InventoryContext";

export function Topbar({ setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    products,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    settings,
  } = useInventory();

  const [searchFocused, setSearchFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute breadcrumbs & title
  const pageTitles = {
    "/": { title: "Dashboard Overview", subtitle: "Real-time stock velocity & store intelligence" },
    "/inventory": { title: "Inventory Catalog", subtitle: "Manage products, pricing, and reorder levels" },
    "/sales": { title: "Sales Management", subtitle: "POS transactions & inventory deduction logs" },
    "/forecasts": { title: "AI Demand Forecasts", subtitle: "Predictive demand curves for smart replenishment" },
    "/recommendations": { title: "Reorder Advice", subtitle: "Algorithmic procurement & safety stock suggestions" },
    "/reports": { title: "Analytics & Reports", subtitle: "Financial performance & inventory turnover metrics" },
    "/settings": { title: "Store & System Settings", subtitle: "Configure store preferences & team roles" },
  };

  const currentMeta = pageTitles[location.pathname] || {
    title: "SmartStock AI",
    subtitle: "Inventory Intelligence Dashboard",
  };

  // Filtered products for quick topbar search
  const searchResults = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.sku.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-hidden"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                {currentMeta.title}
              </h1>
              <span className="hidden sm:inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Retail Edition
              </span>
            </div>
            <p className="hidden md:block text-xs text-slate-500 font-normal">
              {currentMeta.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Search, Notifications, Store Pill, User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search */}
          <div className="relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products, SKU..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-40 sm:w-60 md:w-72 pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-100/80 border border-slate-200 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden transition-all text-slate-800 placeholder-slate-400"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2.5 p-0.5 rounded text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Search Results Dropdown */}
            {searchFocused && query.trim().length > 0 && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50">
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 text-[11px] text-slate-500 font-medium">
                  <span>Found {searchResults.length} product(s)</span>
                  <button
                    onClick={() => setSearchFocused(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    Close
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 mt-1">
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No matching products found.
                    </div>
                  ) : (
                    searchResults.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => {
                          navigate("/inventory");
                          setSearchFocused(false);
                          setQuery("");
                        }}
                        className="p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{prod.name}</p>
                          <p className="text-[10px] text-slate-500">
                            {prod.sku} • {prod.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-900">
                            {settings.currency}{prod.sellingPrice}
                          </p>
                          <span
                            className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                              prod.currentStock === 0
                                ? "bg-rose-100 text-rose-700"
                                : prod.currentStock <= prod.reorderPoint
                                ? "bg-amber-100 text-amber-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            Stock: {prod.currentStock}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-hidden cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-xs animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-700">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={clearAllNotifications}
                    className="text-[11px] font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No notifications right now. Inventory is running smoothly!
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex gap-3 ${
                          !n.read ? "bg-teal-50/40" : ""
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {n.type === "critical" && (
                            <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </div>
                          )}
                          {n.type === "warning" && (
                            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </div>
                          )}
                          {n.type === "info" && (
                            <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
                              <Sparkles className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                            <span className="text-[10px] text-slate-400">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Popover */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 text-teal-300 font-bold text-xs flex items-center justify-center shadow-xs">
                {settings.ownerName ? settings.ownerName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "T"}
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-semibold text-slate-900 leading-none">
                  {settings.ownerName}
                </p>
                <p className="text-[10px] text-slate-500 leading-none mt-1">Retail Owner</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{settings.ownerName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{settings.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition cursor-pointer text-left"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    Store Profile & Config
                  </button>
                  <button
                    onClick={() => {
                      navigate("/recommendations");
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition cursor-pointer text-left"
                  >
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    AI Action Center
                  </button>
                </div>
                <div className="border-t border-slate-100 pt-1">
                  <div className="px-4 py-1.5 text-[10px] text-slate-400">
                    SmartStock AI • v1.0-hackathon
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
