import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getProductById,
  getSimilarProducts,
  estimateDeliveryDate,
  totalStock,
} from "../lib/productRepository.js";

test("getProductById returns the matching product", async () => {
  const product = await getProductById("p-1001");
  assert.equal(product.name, "Embroidered Chiffon Kurta");
});

test("getProductById returns null for an unknown id", async () => {
  const product = await getProductById("does-not-exist");
  assert.equal(product, null);
});

test("getSimilarProducts excludes the product itself and matches category", async () => {
  const similar = await getSimilarProducts("p-1001", 4);
  assert.ok(similar.every((p) => p.id !== "p-1001"));
  assert.ok(similar.every((p) => p.category === "womens-kurta"));
});

test("totalStock sums stock across all sizes", () => {
  const sizes = [
    { size: "S", stock: 2 },
    { size: "M", stock: 0 },
    { size: "L", stock: 5 },
  ];
  assert.equal(totalStock(sizes), 7);
});

test("estimateDeliveryDate formats a min-max range from a fixed date", () => {
  const from = new Date("2026-01-01T00:00:00Z");
  const result = estimateDeliveryDate({ min: 4, max: 5 }, from);
  assert.equal(result, "Jan 5 - Jan 6");
});

test("getSimilarProducts respects the limit argument", async () => {
  const similar = await getSimilarProducts("p-1001", 1);
  assert.equal(similar.length, 1);
});