/**
 * SmartStock AI - Service Layer for API Communication
 * 
 * DESIGNED FOR FUTURE FLASK/PYTHON BACKEND INTEGRATION:
 * When Dev and Kritika complete the Flask backend, update `USE_MOCK_API = false`
 * and point `API_BASE_URL` to your backend server (e.g., http://localhost:5000/api).
 * 
 * PROPOSED API CONTRACT (RESTful JSON):
 * - GET    /api/dashboard          -> Returns { metrics: {...}, salesTrend: [...], lowStock: [...], topProducts: [...] }
 * - GET    /api/products           -> Returns { products: [...] }
 * - POST   /api/products           -> Body: { name, sku, category, sellingPrice, costPrice, currentStock, reorderPoint, supplier }
 * - PUT    /api/products/:id       -> Body: { partial/complete product updates }
 * - DELETE /api/products/:id       -> Returns { success: true, id }
 * - GET    /api/sales              -> Returns { sales: [...] }
 * - POST   /api/sales              -> Body: { items: [{ productId, quantity }], paymentMethod }
 * - GET    /api/forecast/:productId -> Query: ?horizon=7d|14d|30d -> Returns { historical: [...], predicted: [...], aiInsights: ... }
 * - GET    /api/recommendations    -> Returns { recommendations: [...] }
 * - GET    /api/reports            -> Query: ?range=7d|30d|quarter -> Returns { revenueSeries: [...], categoryBreakdown: [...] }
 */

import {
  INITIAL_PRODUCTS,
  INITIAL_SALES,
  HISTORICAL_SALES_TRENDS,
  AI_INSIGHTS_DATA,
  DEMO_FORECAST_MODELS,
} from "../data/mockData";

export const USE_MOCK_API = true;
export const API_BASE_URL = "http://localhost:5000/api";

// Helper for simulated latency or future real fetch
async function fetchHandler(endpoint, options = {}, mockFallback) {
  if (USE_MOCK_API) {
    // Return mock data immediately or with minimal delay for smooth UX
    return mockFallback();
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[SmartStock API] Real API call failed, falling back to mock: ${err.message}`);
    return mockFallback();
  }
}

export const apiService = {
  // --- DASHBOARD ---
  async getDashboardSummary(products, sales) {
    return fetchHandler("/dashboard", { method: "GET" }, () => {
      const activeProducts = products.length;
      const totalInventoryValue = products.reduce((acc, p) => acc + (p.sellingPrice * p.currentStock), 0);
      const lowStockProducts = products.filter(p => p.currentStock <= p.reorderPoint);
      const todaySales = sales
        .filter(s => s.timestamp.startsWith("2026-10-18"))
        .reduce((acc, s) => acc + s.totalAmount, 0);

      return {
        metrics: {
          totalProducts: activeProducts,
          inventoryValue: totalInventoryValue,
          lowStockCount: lowStockProducts.length,
          todaySalesValue: todaySales,
          growthMetrics: {
            products: "+3 this month",
            inventoryValue: "+8.2% vs last week",
            lowStockTrend: lowStockProducts.length > 3 ? "Requires attention" : "Normal level",
            salesTrend: "+14.5% vs yesterday",
          },
        },
        salesTrend: HISTORICAL_SALES_TRENDS["7d"],
        lowStockItems: lowStockProducts.slice(0, 5),
        aiInsights: AI_INSIGHTS_DATA,
      };
    });
  },

  // --- PRODUCTS / INVENTORY ---
  async getProducts() {
    return fetchHandler("/products", { method: "GET" }, () => {
      return [...INITIAL_PRODUCTS];
    });
  },

  async createProduct(newProduct) {
    return fetchHandler("/products", {
      method: "POST",
      body: JSON.stringify(newProduct),
    }, () => {
      return {
        ...newProduct,
        id: `prod-${Date.now()}`,
        lastRestocked: new Date().toISOString().split("T")[0],
      };
    });
  },

  async updateProduct(id, updatedFields) {
    return fetchHandler(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedFields),
    }, () => {
      return { id, ...updatedFields };
    });
  },

  async deleteProduct(id) {
    return fetchHandler(`/products/${id}`, {
      method: "DELETE",
    }, () => {
      return { success: true, id };
    });
  },

  // --- SALES ---
  async getSales() {
    return fetchHandler("/sales", { method: "GET" }, () => {
      return [...INITIAL_SALES];
    });
  },

  async recordSale(salePayload) {
    return fetchHandler("/sales", {
      method: "POST",
      body: JSON.stringify(salePayload),
    }, () => {
      return {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString(),
        status: "Completed",
        ...salePayload,
      };
    });
  },

  // --- AI FORECASTS ---
  async getForecast(productId = "prod-1", horizon = "7d") {
    return fetchHandler(`/forecast/${productId}?horizon=${horizon}`, { method: "GET" }, () => {
      const model = DEMO_FORECAST_MODELS[productId] || DEMO_FORECAST_MODELS["prod-1"];
      return {
        ...model,
        horizon,
        isSimulatedDemo: true,
      };
    });
  },

  // --- REORDER RECOMMENDATIONS ---
  // Baseline formula: Reorder Point = (Avg Daily Demand * Lead Time) + Safety Stock
  // Suggested Order Quantity = max(0, Target Stock - Current Stock)
  async getRecommendations(products) {
    return fetchHandler("/recommendations", { method: "GET" }, () => {
      return products.map(prod => {
        const calculatedROP = Math.round((prod.avgDailyDemand * prod.leadTimeDays) + prod.safetyStock);
        const suggestedQty = Math.max(0, prod.targetStock - prod.currentStock);
        
        let priority = "Normal";
        let urgencyColor = "emerald";
        let reason = "Stock level is stable and above safety buffers.";

        if (prod.currentStock === 0) {
          priority = "Critical";
          urgencyColor = "rose";
          reason = "OUT OF STOCK! Zero units available. Immediate purchase order recommended.";
        } else if (prod.currentStock <= prod.safetyStock) {
          priority = "High Urgency";
          urgencyColor = "amber";
          reason = `Critical: Current stock (${prod.currentStock}) has breached safety stock buffer (${prod.safetyStock}). Stockout imminent in <24-48 hrs.`;
        } else if (prod.currentStock <= calculatedROP) {
          priority = "Moderate";
          urgencyColor = "yellow";
          reason = `Stock (${prod.currentStock}) is at or below reorder threshold (${calculatedROP}). Place order within lead time (${prod.leadTimeDays}d).`;
        }

        return {
          productId: prod.id,
          productName: prod.name,
          sku: prod.sku,
          category: prod.category,
          currentStock: prod.currentStock,
          avgDailyDemand: prod.avgDailyDemand,
          leadTimeDays: prod.leadTimeDays,
          safetyStock: prod.safetyStock,
          reorderPoint: calculatedROP,
          suggestedQuantity: suggestedQty,
          supplier: prod.supplier,
          priority,
          urgencyColor,
          reason,
          estimatedCost: suggestedQty * prod.costPrice,
          reviewed: false,
        };
      });
    });
  },

  // --- REPORTS ---
  async getReports(timeRange = "7d", products, sales) {
    return fetchHandler(`/reports?range=${timeRange}`, { method: "GET" }, () => {
      const trendData = HISTORICAL_SALES_TRENDS[timeRange] || HISTORICAL_SALES_TRENDS["7d"];
      
      // Calculate category value distribution
      const categoryMap = {};
      products.forEach(p => {
        const val = p.sellingPrice * p.currentStock;
        categoryMap[p.category] = (categoryMap[p.category] || 0) + val;
      });

      const categoryDistribution = Object.keys(categoryMap).map(cat => ({
        category: cat,
        value: categoryMap[cat],
      }));

      return {
        timeRange,
        trendData,
        categoryDistribution,
        summary: {
          totalRevenue: trendData.reduce((acc, d) => acc + d.sales, 0),
          totalOrders: trendData.reduce((acc, d) => acc + d.orders, 0),
          averageBasketValue: Math.round(trendData.reduce((acc, d) => acc + d.sales, 0) / trendData.reduce((acc, d) => acc + d.orders, 0)),
          grossMarginPercent: 26.4,
        },
      };
    });
  },
};
