// lib/productRepository.js
//
// Intentional tradeoff: this is a JSON-file-backed repository rather than a real
// database. It's written with the same shape a SQLite/Postgres repository would
// have (async functions, no direct file-system access outside this module) so
// swapping in a real DB later only means changing this file. See README ->
// Future Improvements.

import products from "../data/products.json" with { type: "json" };

/** Simulates realistic network/DB latency so loading states are testable. */
function delay(ms = 120) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getProductById(id) {
  await delay();
  return products.find((p) => p.id === id) ?? null;
}

export async function getSimilarProducts(id, limit = 4) {
  await delay();
  const current = products.find((p) => p.id === id);
  if (!current) return [];

  return products
    .filter((p) => p.id !== id && p.category === current.category)
    .slice(0, limit);
}

export async function getAllProducts() {
  await delay();
  return products;
}

/** Business logic: derive an estimated delivery date range from today. */
export function estimateDeliveryDate(deliveryDays, from = new Date()) {
  const fmt = (d) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const min = new Date(from);
  min.setDate(min.getDate() + deliveryDays.min);
  const max = new Date(from);
  max.setDate(max.getDate() + deliveryDays.max);

  return `${fmt(min)} - ${fmt(max)}`;
}

/** Business logic: total stock across sizes, used for "low stock" style badges. */
export function totalStock(sizes) {
  return sizes.reduce((sum, s) => sum + s.stock, 0);
}
