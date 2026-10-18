import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { useInventory } from "../../context/InventoryContext";

export function AddProductModal({ isOpen, onClose, productToEdit = null }) {
  const { addProduct, updateProduct, settings } = useInventory();

  const [formData, setFormData] = useState({
    name: productToEdit?.name || "",
    sku: productToEdit?.sku || "",
    category: productToEdit?.category || "Grains & Staples",
    sellingPrice: productToEdit?.sellingPrice || "",
    costPrice: productToEdit?.costPrice || "",
    currentStock: productToEdit?.currentStock ?? "",
    reorderPoint: productToEdit?.reorderPoint ?? 15,
    supplier: productToEdit?.supplier || "",
    leadTimeDays: productToEdit?.leadTimeDays ?? 2,
    safetyStock: productToEdit?.safetyStock ?? 5,
    avgDailyDemand: productToEdit?.avgDailyDemand ?? 5,
    targetStock: productToEdit?.targetStock ?? 40,
  });

  const [errors, setErrors] = useState({});

  const categories = [
    "Grains & Staples",
    "Dairy & Eggs",
    "Bakery & Grains",
    "Cooking Essentials",
    "Beverages",
    "Snacks",
    "Household",
    "Packaged Foods",
    "Personal Care",
  ];

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Product name is required";
    if (!formData.sku.trim()) errs.sku = "SKU code is required";
    if (!formData.sellingPrice || Number(formData.sellingPrice) <= 0)
      errs.sellingPrice = "Valid selling price > 0 required";
    if (!formData.costPrice || Number(formData.costPrice) <= 0)
      errs.costPrice = "Valid cost price > 0 required";
    if (formData.currentStock === "" || Number(formData.currentStock) < 0)
      errs.currentStock = "Stock count must be 0 or greater";
    if (formData.reorderPoint === "" || Number(formData.reorderPoint) <= 0)
      errs.reorderPoint = "Reorder threshold must be greater than 0";
    if (!formData.supplier.trim()) errs.supplier = "Supplier name is required";

    if (
      Number(formData.sellingPrice) &&
      Number(formData.costPrice) &&
      Number(formData.sellingPrice) < Number(formData.costPrice)
    ) {
      errs.sellingPrice = "Selling price should be greater than cost price";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      sellingPrice: Number(formData.sellingPrice),
      costPrice: Number(formData.costPrice),
      currentStock: Number(formData.currentStock),
      reorderPoint: Number(formData.reorderPoint),
      leadTimeDays: Number(formData.leadTimeDays),
      safetyStock: Number(formData.safetyStock),
      avgDailyDemand: Number(formData.avgDailyDemand),
      targetStock: Number(formData.targetStock),
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, payload);
    } else {
      addProduct(payload);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={productToEdit ? "Edit Product SKU" : "Add New Inventory Product"}
      subtitle={
        productToEdit
          ? "Update stock, pricing, and supplier parameters"
          : "Register a new product SKU into the SmartStock system"
      }
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name and SKU */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Royal Basmati Rice (1kg)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 text-xs rounded-xl border ${
                errors.name ? "border-rose-400 bg-rose-50/50" : "border-slate-200"
              } focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden`}
            />
            {errors.name && <p className="text-[10px] text-rose-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              SKU Identifier *
            </label>
            <input
              type="text"
              placeholder="e.g. GRN-RICE-001"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
              className={`w-full px-3 py-2 text-xs rounded-xl border font-mono ${
                errors.sku ? "border-rose-400 bg-rose-50/50" : "border-slate-200"
              } focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden`}
            />
            {errors.sku && <p className="text-[10px] text-rose-500 mt-1">{errors.sku}</p>}
          </div>
        </div>

        {/* Category & Supplier */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden bg-white"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Supplier Name *
            </label>
            <input
              type="text"
              placeholder="e.g. AgroFarms Wholesale Ltd"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              className={`w-full px-3 py-2 text-xs rounded-xl border ${
                errors.supplier ? "border-rose-400 bg-rose-50/50" : "border-slate-200"
              } focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden`}
            />
            {errors.supplier && (
              <p className="text-[10px] text-rose-500 mt-1">{errors.supplier}</p>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Selling Price ({settings.currency}) *
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="120"
              value={formData.sellingPrice}
              onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
              className={`w-full px-3 py-2 text-xs rounded-xl border bg-white ${
                errors.sellingPrice ? "border-rose-400" : "border-slate-200"
              } focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden`}
            />
            {errors.sellingPrice && (
              <p className="text-[10px] text-rose-500 mt-1">{errors.sellingPrice}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Cost / Purchase Price ({settings.currency}) *
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="95"
              value={formData.costPrice}
              onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
              className={`w-full px-3 py-2 text-xs rounded-xl border bg-white ${
                errors.costPrice ? "border-rose-400" : "border-slate-200"
              } focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden`}
            />
            {errors.costPrice && (
              <p className="text-[10px] text-rose-500 mt-1">{errors.costPrice}</p>
            )}
          </div>
        </div>

        {/* Stock & Reorder Points */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Current Stock (Units) *
            </label>
            <input
              type="number"
              placeholder="25"
              value={formData.currentStock}
              onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
              className={`w-full px-3 py-2 text-xs rounded-xl border ${
                errors.currentStock ? "border-rose-400 bg-rose-50/50" : "border-slate-200"
              } focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden`}
            />
            {errors.currentStock && (
              <p className="text-[10px] text-rose-500 mt-1">{errors.currentStock}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reorder Point (ROP) *
            </label>
            <input
              type="number"
              placeholder="15"
              value={formData.reorderPoint}
              onChange={(e) => setFormData({ ...formData, reorderPoint: e.target.value })}
              className={`w-full px-3 py-2 text-xs rounded-xl border ${
                errors.reorderPoint ? "border-rose-400 bg-rose-50/50" : "border-slate-200"
              } focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden`}
            />
            {errors.reorderPoint && (
              <p className="text-[10px] text-rose-500 mt-1">{errors.reorderPoint}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Supplier Lead Time (Days)
            </label>
            <input
              type="number"
              placeholder="2"
              value={formData.leadTimeDays}
              onChange={(e) => setFormData({ ...formData, leadTimeDays: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl shadow-md shadow-teal-500/20 transition cursor-pointer"
          >
            {productToEdit ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
