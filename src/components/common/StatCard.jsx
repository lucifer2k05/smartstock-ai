import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = "neutral", // "up" | "down" | "neutral" | "warning"
  accentColor = "teal", // "teal" | "emerald" | "amber" | "indigo" | "rose"
}) {
  const colorMap = {
    teal: "bg-teal-50 text-teal-600 border-teal-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
  };

  const trendColorMap = {
    up: "text-emerald-600 bg-emerald-50",
    down: "text-rose-600 bg-rose-50",
    neutral: "text-slate-600 bg-slate-100",
    warning: "text-amber-700 bg-amber-50",
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-lg border ${colorMap[accentColor] || colorMap.teal}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          {trend && (
            <span
              className={`inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded-md ${
                trendColorMap[trendType] || trendColorMap.neutral
              }`}
            >
              {trendType === "up" && <ArrowUpRight className="w-3.5 h-3.5" />}
              {trendType === "down" && <ArrowDownRight className="w-3.5 h-3.5" />}
              {trendType === "neutral" && <Minus className="w-3.5 h-3.5" />}
              {trend}
            </span>
          )}
          {subtitle && <span className="truncate">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
