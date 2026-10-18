import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { useInventory } from "../../context/InventoryContext";
import { Plus, Trash2, ShoppingCart, AlertCircle } from "lucide-react";

export function RecordSaleModal({ isOpen, onClose }) {
  const { products, recordSale, settings } = useInventory();

  // Multi-item cart
  const [cartItems, setCartItems] = useState([
    { productId: products[0]?.id || "", quantity: 1 },
  ]);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [customerType, setCustomerType] = useState("Walk-in Customer");
  const [errorMsg, setErrorMsg] = useState("");

  const handleProductChange = (index, prodId) => {
    const updated = [...cartItems];
    updated[index].productId = prodId;
    setCartItems(updated);
    setErrorMsg("");
  };

  const handleQuantityChange = (index, qty) => {
    const updated = [...cartItems];
    updated[index].quantity = Math.max(1, parseInt(qty) || 1);
    setCartItems(updated);
    setErrorMsg("");
  };

  const handleAddItem = () => {
    const available = products.find(
      (p) => !cartItems.some((item) => item.productId === p.id)
    );
    setCartItems([
      ...cartItems,
      { productId: available ? available.id : products[0]?.id, quantity: 1 },
    ]);
  };

  const handleRemoveItem = (index) => {
    if (cartItems.length > 1) {
      setCartItems(cartItems.filter((_, i) => i !== index));
    }
  };

  // Calculations
  const calculatedItems = cartItems.map((item) => {
    const prod = products.find((p) => p.id === item.productId);
    const price = prod ? prod.sellingPrice : 0;
    const subtotal = price * item.quantity;
    const availableStock = prod ? prod.currentStock : 0;
    const isExceeded = item.quantity > availableStock;
    return {
      ...item,
      productName: prod ? prod.name : "Unknown",
      price,
      subtotal,
      availableStock,
      isExceeded,
    };
  });

  const totalAmount = calculatedItems.reduce((acc, item) => acc + item.subtotal, 0);
  const totalQuantity = calculatedItems.reduce((acc, item) => acc + item.quantity, 0);
  const hasExceededStock = calculatedItems.some((item) => item.isExceeded);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hasExceededStock) {
      setErrorMsg("One or more items exceed current on-hand stock.");
      return;
    }
    if (totalAmount <= 0) {
      setErrorMsg("Sale total must be greater than zero.");
      return;
    }

    const payload = {
      items: calculatedItems.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      })),
      totalQuantity,
      totalAmount,
      paymentMethod,
      customerType,
    };

    const result = await recordSale(payload);
    if (result.success) {
      // Reset form
      setCartItems([{ productId: products[0]?.id || "", quantity: 1 }]);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record New Store Sale (POS)"
      subtitle="Instantly update inventory levels and capture transactional revenue"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Cart Items List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Sale Items
            </label>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Another SKU
            </button>
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {calculatedItems.map((item, index) => (
              <div
                key={index}
                className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  item.isExceeded
                    ? "border-rose-300 bg-rose-50/40"
                    : "border-slate-200 bg-slate-50/60"
                }`}
              >
                {/* Product Select */}
                <div className="flex-1">
                  <select
                    value={item.productId}
                    onChange={(e) => handleProductChange(index, e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:border-teal-500"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {settings.currency}{p.sellingPrice} (In Stock: {p.currentStock})
                      </option>
                    ))}
                  </select>
                  {item.isExceeded && (
                    <p className="text-[10px] text-rose-600 font-semibold mt-1">
                      Exceeds available inventory ({item.availableStock} in stock)!
                    </p>
                  )}
                </div>

                {/* Quantity Controls & Subtotal */}
                <div className="flex items-center gap-3">
                  <div className="w-20">
                    <input
                      type="number"
                      min="1"
                      max={item.availableStock || 1}
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs text-center rounded-lg border border-slate-200 bg-white font-semibold"
                    />
                  </div>

                  <div className="w-24 text-right">
                    <span className="text-xs font-bold text-slate-900">
                      {settings.currency}{item.subtotal.toLocaleString()}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    disabled={cartItems.length === 1}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer & Payment Method */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["UPI", "Cash", "Card"].map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                    paymentMethod === method
                      ? "border-teal-500 bg-teal-50 text-teal-800 shadow-xs"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Customer Category
            </label>
            <select
              value={customerType}
              onChange={(e) => setCustomerType(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-teal-500 focus:outline-hidden"
            >
              <option value="Walk-in Customer">Walk-in Regular</option>
              <option value="Family Shopper">Family Shopper</option>
              <option value="Student">Student / Youth</option>
              <option value="Commercial / B2B">Local Café / Small Vendor</option>
            </select>
          </div>
        </div>

        {/* Summary Footer */}
        <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between mt-4">
          <div>
            <p className="text-[11px] text-slate-400">Total Billable Amount</p>
            <p className="text-xl font-black text-teal-300">
              {settings.currency}{totalAmount.toLocaleString()}
            </p>
          </div>
          <div className="text-right text-xs text-slate-300">
            <span>{totalQuantity} Units across {cartItems.length} SKU(s)</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={hasExceededStock}
            className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl shadow-md shadow-teal-500/25 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Complete & Deduct Stock</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
