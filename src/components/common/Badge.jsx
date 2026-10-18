import React from "react";

export function Badge({ children, variant = "default", size = "md", className = "" }) {
  const baseClasses = "inline-flex items-center font-medium rounded-full transition-colors";

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1 text-sm",
  };

  const variantClasses = {
    default: "bg-slate-100 text-slate-700 border border-slate-200",
    inStock: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    lowStock: "bg-amber-50 text-amber-700 border border-amber-200",
    outOfStock: "bg-rose-50 text-rose-700 border border-rose-200",
    critical: "bg-red-50 text-red-700 border border-red-200 animate-pulse",
    ai: "bg-teal-50 text-teal-700 border border-teal-200",
    info: "bg-sky-50 text-sky-700 border border-sky-200",
  };

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${
        variantClasses[variant] || variantClasses.default
      } ${className}`}
    >
      {children}
    </span>
  );
}

export function StockStatusBadge({ currentStock, reorderPoint }) {
  if (currentStock === 0) {
    return (
      <Badge variant="outOfStock">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span>
        Out of Stock
      </Badge>
    );
  }
  if (currentStock <= reorderPoint) {
    return (
      <Badge variant="lowStock">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
        Low Stock ({currentStock})
      </Badge>
    );
  }
  return (
    <Badge variant="inStock">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
      In Stock
    </Badge>
  );
}
