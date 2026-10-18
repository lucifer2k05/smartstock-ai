import React, { createContext, useContext, useState, useEffect } from "react";
import {
  INITIAL_PRODUCTS,
  INITIAL_SALES,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS,
} from "../data/mockData";
import { apiService } from "../services/api";

const InventoryContext = createContext(null);

const STORAGE_KEYS = {
  PRODUCTS: "smartstock_products_v1",
  SALES: "smartstock_sales_v1",
  NOTIFICATIONS: "smartstock_notifications_v1",
  SETTINGS: "smartstock_settings_v1",
};

export function InventoryProvider({ children }) {
  // Load from localStorage or initial defaults
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [sales, setSales] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SALES);
      return saved ? JSON.parse(saved) : INITIAL_SALES;
    } catch {
      return INITIAL_SALES;
    }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Global search input state
  const [searchQuery, setSearchQuery] = useState("");

  // Toast alert feedback
  const [toast, setToast] = useState(null);

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Product CRUD
  const addProduct = async (productData) => {
    const created = await apiService.createProduct(productData);
    setProducts((prev) => [created, ...prev]);
    showToast(`Product "${created.name}" added successfully.`);
    return created;
  };

  const updateProduct = async (id, updatedFields) => {
    await apiService.updateProduct(id, updatedFields);
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
    showToast(`Product "${updatedFields.name || id}" updated successfully.`);
  };

  const deleteProduct = async (id) => {
    const target = products.find((p) => p.id === id);
    await apiService.deleteProduct(id);
    setProducts((prev) => prev.filter((item) => item.id !== id));
    showToast(`Product "${target?.name || id}" removed from inventory.`, "info");
  };

  // Record Sale: atomic frontend transaction + stock reduction
  const recordSale = async (saleData) => {
    // Validate quantities against current stock
    for (const item of saleData.items) {
      const currentProd = products.find((p) => p.id === item.productId);
      if (!currentProd) {
        showToast(`Product not found: ${item.productName}`, "error");
        return { success: false, error: "Product not found" };
      }
      if (item.quantity > currentProd.currentStock) {
        showToast(
          `Insufficient stock for ${currentProd.name}. Available: ${currentProd.currentStock}`,
          "error"
        );
        return { success: false, error: "Insufficient stock" };
      }
    }

    const recorded = await apiService.recordSale(saleData);

    // Decrease stock for sold items
    const newStockAlerts = [];
    setProducts((prev) =>
      prev.map((prod) => {
        const soldItem = saleData.items.find((i) => i.productId === prod.id);
        if (soldItem) {
          const updatedStock = Math.max(0, prod.currentStock - soldItem.quantity);
          
          // Check for threshold alerts
          if (updatedStock === 0) {
            newStockAlerts.push({
              id: `notif-auto-${Date.now()}-${prod.id}`,
              title: `Out of Stock: ${prod.name}`,
              message: `Stock reached 0 units following Sale ${recorded.id}. Immediate reorder required!`,
              time: "Just now",
              read: false,
              type: "critical",
            });
          } else if (updatedStock <= prod.reorderPoint && prod.currentStock > prod.reorderPoint) {
            newStockAlerts.push({
              id: `notif-auto-${Date.now()}-${prod.id}`,
              title: `Low Stock Alert: ${prod.name}`,
              message: `Stock dropped to ${updatedStock} units (below reorder point of ${prod.reorderPoint}).`,
              time: "Just now",
              read: false,
              type: "warning",
            });
          }

          return { ...prod, currentStock: updatedStock };
        }
        return prod;
      })
    );

    // Add transaction to sales history
    setSales((prev) => [recorded, ...prev]);

    // Prepend any generated alerts
    if (newStockAlerts.length > 0) {
      setNotifications((prev) => [...newStockAlerts, ...prev]);
    }

    showToast(`Sale recorded successfully! Total: ${settings.currency}${saleData.totalAmount}`);
    return { success: true, transaction: recorded };
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast("Notifications cleared", "info");
  };

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast("Settings saved successfully.");
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.SALES);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    setProducts(INITIAL_PRODUCTS);
    setSales(INITIAL_SALES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSettings(INITIAL_SETTINGS);
    showToast("Demo data reset to default catalog & sales history.", "info");
  };

  // Computed metrics
  const totalProducts = products.length;
  const totalInventoryValue = products.reduce(
    (acc, p) => acc + p.sellingPrice * p.currentStock,
    0
  );
  const lowStockCount = products.filter(
    (p) => p.currentStock <= p.reorderPoint
  ).length;
  const outOfStockCount = products.filter((p) => p.currentStock === 0).length;

  const value = {
    products,
    sales,
    notifications,
    settings,
    searchQuery,
    setSearchQuery,
    toast,
    showToast,
    addProduct,
    updateProduct,
    deleteProduct,
    recordSale,
    markNotificationRead,
    clearAllNotifications,
    updateSettings,
    resetDemoData,
    metrics: {
      totalProducts,
      totalInventoryValue,
      lowStockCount,
      outOfStockCount,
      inStockCount: totalProducts - lowStockCount,
    },
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
