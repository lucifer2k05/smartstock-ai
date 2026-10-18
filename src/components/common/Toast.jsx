import React from "react";
import { CheckCircle2, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { useInventory } from "../../context/InventoryContext";

export function Toast() {
  const { toast } = useInventory();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-teal-500 shrink-0" />,
  };

  const bgStyles = {
    success: "border-emerald-200 bg-white text-slate-800 shadow-emerald-500/10",
    warning: "border-amber-200 bg-white text-slate-800 shadow-amber-500/10",
    error: "border-rose-200 bg-white text-slate-800 shadow-rose-500/10",
    info: "border-teal-200 bg-white text-slate-800 shadow-teal-500/10",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-in">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${
          bgStyles[toast.type] || bgStyles.info
        }`}
      >
        {icons[toast.type] || icons.info}
        <p className="text-sm font-medium text-slate-800">{toast.message}</p>
      </div>
    </div>
  );
}
