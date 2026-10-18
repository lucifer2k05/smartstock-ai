import React, { useState, useMemo } from "react";
import {
  Package,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  TrendingDown,
} from "lucide-react";
import { useInventory } from "../context/InventoryContext";
import { StockStatusBadge } from "../components/common/Badge";
import { Modal } from "../components/common/Modal";
import { AddProductModal } from "../components/inventory/AddProductModal";

export function Inventory() {
  const { products, deleteProduct, metrics, settings } = useInventory();

  // Search, filter, and sort states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All"); // All, inStock, lowStock, outOfStock
  const [sortBy, setSortBy] = useState("name"); // name, stockAsc, stockDesc, priceAsc, priceDesc

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((prod) => {
        const matchesSearch =
          prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prod.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prod.supplier?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
          selectedCategory === "All" || prod.category === selectedCategory;

        let matchesStatus = true;
        if (selectedStatus === "inStock") {
          matchesStatus = prod.currentStock > prod.reorderPoint;
        } else if (selectedStatus === "lowStock") {
          matchesStatus = prod.currentStock <= prod.reorderPoint && prod.currentStock > 0;
        } else if (selectedStatus === "outOfStock") {
          matchesStatus = prod.currentStock === 0;
        }

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "stockAsc") return a.currentStock - b.currentStock;
        if (sortBy === "stockDesc") return b.currentStock - a.currentStock;
        if (sortBy === "priceAsc") return a.sellingPrice - b.sellingPrice;
        if (sortBy === "priceDesc") return b.sellingPrice - a.sellingPrice;
        return 0;
      });
  }, [products, searchTerm, selectedCategory, selectedStatus, sortBy]);

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Inventory Catalog & Stock Control
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time stock tracking, safety buffers, and SKU catalog management
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl shadow-md shadow-teal-500/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Stock Health Badges Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Total Catalog</p>
            <p className="text-lg font-black text-slate-900">{metrics.totalProducts} SKUs</p>
          </div>
          <Package className="w-5 h-5 text-indigo-500" />
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Healthy Stock</p>
            <p className="text-lg font-black text-emerald-600">{metrics.inStockCount} SKUs</p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Low Stock</p>
            <p className="text-lg font-black text-amber-600">
              {metrics.lowStockCount - metrics.outOfStockCount} SKUs
            </p>
          </div>
          <AlertTriangle className="w-5 h-5 text-amber-500" />
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Out of Stock</p>
            <p className="text-lg font-black text-rose-600">{metrics.outOfStockCount} SKUs</p>
          </div>
          <TrendingDown className="w-5 h-5 text-rose-500" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by SKU, product, supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-hidden"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 shrink-0">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-hidden"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 shrink-0">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="inStock">In Stock (Healthy)</option>
              <option value="lowStock">Low Stock (Below ROP)</option>
              <option value="outOfStock">Out of Stock (Zero Units)</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-hidden"
            >
              <option value="name">Sort: Name (A-Z)</option>
              <option value="stockAsc">Stock: Low to High</option>
              <option value="stockDesc">Stock: High to Low</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Applied Filter Tags Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-800">{filteredProducts.length}</strong> of{" "}
            {products.length} products
          </span>

          {(searchTerm || selectedCategory !== "All" || selectedStatus !== "All") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSelectedStatus("All");
              }}
              className="text-teal-600 hover:text-teal-700 font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Product & SKU</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Price / Cost</th>
                <th className="py-3.5 px-3">Stock Level</th>
                <th className="py-3.5 px-3 text-center">Reorder Point</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold">No products match your search or filter</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try adjusting the filter criteria or add a new product above.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const stockPercent = Math.min(
                    100,
                    Math.round((prod.currentStock / (prod.reorderPoint * 2)) * 100)
                  );

                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & SKU */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{prod.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {prod.sku} • {prod.supplier || "Direct"}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                          {prod.category}
                        </span>
                      </td>

                      {/* Selling & Cost Price */}
                      <td className="py-3.5 px-3">
                        <p className="font-bold text-slate-900">
                          {settings.currency}{prod.sellingPrice}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Cost: {settings.currency}{prod.costPrice}
                        </p>
                      </td>

                      {/* Current Stock with Progress Bar */}
                      <td className="py-3.5 px-3 min-w-[130px]">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span
                            className={`font-black ${
                              prod.currentStock === 0
                                ? "text-rose-600"
                                : prod.currentStock <= prod.reorderPoint
                                ? "text-amber-600"
                                : "text-slate-900"
                            }`}
                          >
                            {prod.currentStock} units
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {prod.avgDailyDemand}/day
                          </span>
                        </div>
                        {/* Visual bar */}
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              prod.currentStock === 0
                                ? "bg-rose-500 w-0"
                                : prod.currentStock <= prod.reorderPoint
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${Math.max(5, stockPercent)}%` }}
                          />
                        </div>
                      </td>

                      {/* Reorder Point */}
                      <td className="py-3.5 px-3 text-center">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-xs">
                          {prod.reorderPoint}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-3 text-center">
                        <StockStatusBadge
                          currentStock={prod.currentStock}
                          reorderPoint={prod.reorderPoint}
                        />
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right space-x-1">
                        <button
                          onClick={() => {
                            setEditingProduct(prod);
                            setIsAddModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition cursor-pointer"
                          title="Edit product SKU"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setProductToDelete(prod)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingProduct(null);
          }}
          productToEdit={editingProduct}
        />
      )}

      {/* Confirmation Dialog for Delete */}
      <Modal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        title="Confirm SKU Deletion"
        subtitle="This action cannot be undone"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
            Are you sure you want to delete{" "}
            <strong>"{productToDelete?.name}"</strong> ({productToDelete?.sku})? Historical
            sales logs will retain the record, but this product will be removed from your active catalog.
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setProductToDelete(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md transition cursor-pointer"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
