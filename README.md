# SmartStock AI — Frontend Web Application
**AI-Powered Inventory Intelligence for Small Retailers**

Built for our College Startup Hackathon by **Alex Morgan (Frontend Lead)** with future integration paths for **Dev (AI/Forecasting)**, **Kritika (Backend/DB)**, and **Dhruv (Cloud/CyberSec)**.

---

## 🌟 Executive Summary & Problem Solved

Small grocery stores, neighborhood marts, and independent retail shops often manage inventory through paper notebooks or mental memory. This causes:
1. **Costly Stockouts:** High-velocity essentials (milk, bread, staples) run out abruptly, driving customers to competitors.
2. **Capital Trapping:** Over-ordering slow-moving SKUs ties up limited working capital.
3. **No Demand Visibility:** Inability to predict weekend spikes or supplier lead-time buffers.

**SmartStock AI** solves this by providing a unified SaaS dashboard offering real-time stock velocity, point-of-sale checkout with immediate inventory depletion, explainable AI demand forecasting curves, and algorithmic reorder advice.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18+ recommended; tested on Node v24)
- **npm** (v9+)

### Installation & Run Commands
```bash
# 1. Navigate to the project directory
cd smartstock-ai

# 2. Install dependencies (already pre-configured)
npm install

# 3. Start local development server
npm run dev

# 4. Open in browser: http://localhost:5173
```

*(Note for Windows PowerShell users: If script execution policy is restricted, invoke `npm.cmd run dev` or run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`)*

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| **React 19** | Modern component-based UI with hooks and Context API |
| **Vite 8** | Ultra-fast development server and optimized production bundler |
| **Tailwind CSS v4** | Utility-first styling with sleek slate/teal SaaS design system |
| **Recharts** | Responsive SVG charts (Area, Donut, Line curves) |
| **Lucide React** | Consistent, modern icon set |
| **React Router v7** | Client-side page navigation with URL synchronization |
| **Fetch API Service Layer** | Clean mock service layer mirroring future Flask REST API endpoints |

---

## 📂 Project Structure

```text
smartstock-ai/
├── public/                     # Static public assets
├── src/
│   ├── assets/                 # Icons and image assets
│   ├── components/
│   │   ├── common/             # Reusable UI primitives
│   │   │   ├── Badge.jsx       # Status badges (In Stock, Low Stock, etc.)
│   │   │   ├── StatCard.jsx    # Metric KPI cards with trend indicators
│   │   │   ├── Modal.jsx       # Accessible modal container with backdrop
│   │   │   └── Toast.jsx       # Toast alert notification system
│   │   ├── layout/
│   │   │   ├── Layout.jsx      # Persistent application shell
│   │   │   ├── Sidebar.jsx     # Collapsible responsive sidebar
│   │   │   └── Topbar.jsx      # Top navigation, global search & notifications
│   │   ├── dashboard/
│   │   │   ├── SalesChart.jsx  # Recharts Area chart with 7d/14d/30d filter
│   │   │   ├── StockDistributionChart.jsx # Donut chart of inventory health
│   │   │   ├── LowStockList.jsx           # Urgent low-stock action table
│   │   │   ├── TopSellingList.jsx         # Ranked velocity list
│   │   │   └── AiInsightsCard.jsx         # AI store intelligence banner
│   │   ├── inventory/
│   │   │   └── AddProductModal.jsx        # Product SKU creation & edit form
│   │   └── sales/
│   │       └── RecordSaleModal.jsx        # POS multi-item checkout modal
│   ├── context/
│   │   └── InventoryContext.jsx# Centralized state (products, sales, notifications)
│   ├── data/
│   │   └── mockData.js         # Realistic retail dataset (12 SKUs, 8 transactions)
│   ├── pages/
│   │   ├── Dashboard.jsx       # Primary landing page with KPIs and charts
│   │   ├── Inventory.jsx       # Complete inventory table with full CRUD
│   │   ├── Sales.jsx           # POS transaction history and sales logger
│   │   ├── Forecasts.jsx       # AI predictive demand curves & explanation
│   │   ├── Recommendations.jsx # Algorithmic procurement formulas & PO creation
│   │   ├── Reports.jsx         # Business analytics & client-side CSV export
│   │   └── Settings.jsx        # Store profile, alerts & team allocation
│   ├── services/
│   │   └── api.js              # Service layer with REST contracts for Flask
│   ├── App.jsx                 # Routing configuration
│   ├── main.jsx                # React root mount
│   └── index.css               # Tailwind v4 import & typography
├── package.json
└── README.md
```

---

## 💡 Implemented Frontend Features

1. **Dashboard Overview (`/`):**
   - KPI metrics: Active Products, Total Inventory Valuation, Low Stock Alerts, Today's Sales.
   - Interactive Recharts Sales Velocity Area Chart (7-day, 14-day, 30-day filters).
   - Inventory Health Donut chart with live percentage breakdown.
   - Low-stock quick-action table with direct reorder navigation.
   - Top-selling velocity products.
   - Highlighted AI Insights panel with actionable recommendations.

2. **Inventory Management (`/inventory`):**
   - Full CRUD capability: Add new SKU, Edit product details, Delete SKU with confirmation dialog.
   - Live search by product name, SKU code, or supplier name.
   - Category filtering & stock status filtering (Healthy, Low Stock, Out of Stock).
   - Dynamic sorting by name, price, and stock levels.
   - Visual progress bars comparing current stock to safety buffers.

3. **Sales Management & Real-Time Stock Depletion (`/sales`):**
   - Multi-item Point-of-Sale (POS) modal with real-time stock availability validation.
   - Transaction completes immediately in frontend state, **decreasing product stock automatically**.
   - Automatic trigger of low-stock and out-of-stock notification alerts when thresholds are breached.
   - Transaction log with payment method badges (UPI, Cash, Card) and customer categories.

4. **AI Demand Forecasts (`/forecasts`):**
   - Product selector and forecast horizon selector (7, 14, 30 days).
   - Dual-line chart showing historical verified sales alongside dashed forward-looking AI predictions.
   - Explainable AI rationalization card explaining why demand will fluctuate (seasonality, holiday spikes).
   - Clear disclosure badge indicating simulated deterministic model ready for backend model connection.

5. **Reorder Recommendations (`/recommendations`):**
   - Transparent inventory formulas:
     - `Reorder Point = (Daily Demand × Lead Time) + Safety Stock`
     - `Suggested Order Quantity = max(0, Target Stock − Current Stock)`
   - Filter by priority (Critical, High Urgency, Moderate, Normal).
   - Actions to mark recommendations as reviewed or generate a purchase order with instant feedback.

6. **Reports & Analytics (`/reports`):**
   - Sales and order velocity trends over time.
   - Capital allocation bar chart by product category.
   - Fast-moving vs slow-moving inventory analysis.
   - Client-side **Export to CSV** generating downloadable Excel/Sheets compatible reports.

7. **Settings & Demo Controls (`/settings`):**
   - Configurable store metadata (name, address, tax rate, currency symbol).
   - Notification toggles and table density preferences.
   - Team allocation matrix and cybersecurity placeholder for Dhruv.
   - **"Reset Demo Data"** button to restore original catalog and sales state during live hackathon demos.

---

## 🔗 Future Flask / Python Backend Integration Contract

When **Dev** (AI) and **Kritika** (Backend/DB) deploy the Python/Flask server, update `USE_MOCK_API = false` in `src/services/api.js`.

### Proposed REST API Endpoints:
```http
GET    /api/dashboard              -> Returns dashboard KPI metrics & trends
GET    /api/products               -> Returns array of product objects
POST   /api/products               -> Creates a new product SKU
PUT    /api/products/<id>          -> Updates existing product
DELETE /api/products/<id>          -> Removes product from catalog
GET    /api/sales                  -> Returns array of sales transactions
POST   /api/sales                  -> Creates sales record & deducts inventory
GET    /api/forecast/<product_id>  -> Returns historical and predicted demand array
GET    /api/recommendations        -> Returns formula-based & ML replenishment advice
GET    /api/reports?range=7d       -> Returns financial and turnover aggregations
```
