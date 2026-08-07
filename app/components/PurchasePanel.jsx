"use client";

import { useState } from "react";

function formatPrice(amount, currency) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PurchasePanel({ product, estimatedDelivery }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [status, setStatus] = useState(null); // { type: 'error' | 'success', message }
  const [pending, setPending] = useState(false);

  const availableSizes = product.sizes.filter((s) => s.stock > 0);
  const isSoldOut = availableSizes.length === 0;

  async function handleAction(action) {
    if (!selectedSize) {
      setStatus({ type: "error", message: "Please select a size to continue." });
      return;
    }

    setPending(true);
    setStatus(null);

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          size: selectedSize,
          action,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: "error", message: data.error ?? "Something went wrong." });
        return;
      }

      setStatus({
        type: "success",
        message:
          action === "buy-now"
            ? `Proceeding to checkout with size ${selectedSize}.`
            : `Added to cart — size ${selectedSize}.`,
      });
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Price */}
      <div>
        <div className="text-2xl font-medium">
          {formatPrice(product.price, product.currency)}
        </div>
        <div className="text-xs text-black/40 mt-1">Tax incl. &middot; No hidden fees</div>
      </div>

      {/* Size selector */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Select size</span>
          {!isSoldOut && (
            <span className="text-xs text-black/40">
              {availableSizes.length} of {product.sizes.length} sizes available
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {product.sizes.map(({ size, stock }) => {
            const outOfStock = stock === 0;
            const isSelected = selectedSize === size;
            return (
              <button
                key={size}
                type="button"
                disabled={outOfStock}
                onClick={() => {
                  setSelectedSize(size);
                  setStatus(null);
                }}
                aria-pressed={isSelected}
                className={[
                  "relative min-w-12 h-11 px-3 border text-sm transition-colors",
                  outOfStock
                    ? "border-black/10 text-black/30 cursor-not-allowed"
                    : isSelected
                    ? "border-black bg-black text-white"
                    : "border-black/20 hover:border-black",
                ].join(" ")}
              >
                {size}
                {outOfStock && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="w-full h-px bg-black/30 rotate-[-14deg]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {isSoldOut && (
          <p className="text-xs text-red-600 mt-2">
            Sold out in all sizes right now — see similar picks below.
          </p>
        )}

        {selectedSize && (() => {
          const stockLeft = product.sizes.find((s) => s.size === selectedSize)?.stock ?? 0;
          if (stockLeft > 0 && stockLeft < 5) {
            return (
              <p className="text-xs text-amber-700 mt-2">
                Only {stockLeft} left in stock — size {selectedSize}
              </p>
            );
          }
          return null;
        })()}
      </div>

      {/* Delivery trust */}
      <div className="flex items-start gap-3 border border-black/10 bg-white/60 rounded-md px-4 py-3">
        <span className="text-lg leading-none mt-0.5">🚚</span>
        <div>
          <div className="text-sm font-medium">
            Estimated delivery: {estimatedDelivery}
          </div>
          <div className="text-xs text-black/40 mt-0.5">
            Delivered by our logistics partner &middot; tracked from dispatch
          </div>
        </div>
      </div>

      {/* Actions */}
      {!isSoldOut && (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => handleAction("buy-now")}
            className="w-full h-12 bg-black text-white text-sm font-medium disabled:opacity-50"
          >
            {pending ? "Please wait…" : "Buy Now"}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => handleAction("add-to-cart")}
            className="w-full h-12 border border-black text-sm font-medium disabled:opacity-50"
          >
            Add to Cart
          </button>
        </div>
      )}

      {!isSoldOut && (
        <div className="grid grid-cols-3 gap-2 text-center border-t border-black/10 pt-4">
          <div className="flex flex-col items-center gap-1">
            <span className="text-base leading-none">✅</span>
            <span className="text-[11px] text-black/50 leading-tight">100% Original Brand</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-base leading-none">↩️</span>
            <span className="text-[11px] text-black/50 leading-tight">Easy 7-Day Returns</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-base leading-none">📦</span>
            <span className="text-[11px] text-black/50 leading-tight">Free Shipping over Rs. 5,000</span>
          </div>
        </div>
      )}

      {status && (
        <p
          role="status"
          className={
            status.type === "error"
              ? "text-xs text-red-600"
              : "text-xs text-green-700"
          }
        >
          {status.message}
        </p>
      )}
    </div>
  );
}
