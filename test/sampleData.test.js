import test from "node:test";
import assert from "node:assert/strict";
import { sampleCompetitorGroups, sampleProducts, sampleReviews } from "../src/shared/sampleData.js";

test("sampleData provides 50 robovac products with 50 reviews for each product", () => {
  assert.equal(sampleProducts.length, 50);
  assert.equal(sampleReviews.length, 2500);

  const productIds = new Set(sampleProducts.map((product) => product.id));
  assert.equal(productIds.size, 50);

  for (const product of sampleProducts) {
    const reviews = sampleReviews.filter((review) => review.productId === product.id);
    assert.equal(reviews.length, 50, `${product.id} should have 50 reviews`);
    assert.equal(product.category.includes("Robot"), true);
    assert.equal(Array.isArray(product.features), true);
    assert.equal(product.features.length >= 4, true);
  }
});

test("sampleCompetitorGroups only reference products that exist in sampleProducts", () => {
  const productIds = new Set(sampleProducts.map((product) => product.id));

  for (const group of sampleCompetitorGroups) {
    assert.equal(group.productIds.length > 0, true);
    for (const productId of group.productIds) {
      assert.equal(productIds.has(productId), true, `${group.id} references missing ${productId}`);
    }
  }
});
