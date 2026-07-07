import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { buildRobovacDataset, isRobovacProduct } from "../scripts/buildRobovacDataset.mjs";

test("isRobovacProduct matches robot vacuum metadata and excludes generic vacuums", () => {
  assert.equal(isRobovacProduct({ title: "Roborock S8 Robot Vacuum and Mop" }), true);
  assert.equal(isRobovacProduct({ title: "Cordless Stick Vacuum Cleaner" }), false);
});

test("buildRobovacDataset ranks products by rating_number and reviews by helpful_votes", async () => {
  const dir = await mkdtemp(join(tmpdir(), "robovac-builder-"));
  const metaFile = join(dir, "meta.jsonl");
  const reviewsFile = join(dir, "reviews.jsonl");

  await writeFile(metaFile, [
    JSON.stringify({ parent_asin: "A1", title: "Low Heat Robot Vacuum", store: "Brand A", price: 199, average_rating: 4.1, rating_number: 10, features: ["robot vacuum"] }),
    JSON.stringify({ parent_asin: "A2", title: "Top Heat Robotic Vacuum Mop", store: "Brand B", price: 499, average_rating: 4.5, rating_number: 300, features: ["vacuum mop"] }),
    JSON.stringify({ parent_asin: "A3", title: "Medium Heat Roomba Robot Vacuum", store: "Brand C", price: 399, average_rating: 4.4, rating_number: 120, features: ["self-emptying"] }),
    JSON.stringify({ parent_asin: "A4", title: "Cordless Stick Vacuum", store: "Brand D", rating_number: 9999 })
  ].join("\n"));

  await writeFile(reviewsFile, [
    JSON.stringify({ parent_asin: "A2", title: "Most helpful", text: "Great mapping.", rating: 5, helpful_vote: 40, verified_purchase: true, timestamp: 1735689600000 }),
    JSON.stringify({ parent_asin: "A2", title: "Less helpful", text: "Loud dock.", rating: 3, helpful_vote: 2, verified_purchase: true, timestamp: 1735776000000 }),
    JSON.stringify({ parent_asin: "A3", title: "Helpful", text: "Good for pet hair.", rating: 4, helpful_vote: 20, verified_purchase: false }),
    JSON.stringify({ parent_asin: "A1", title: "Helpful", text: "Cheap and simple.", rating: 4, helpful_vote: 7, verified_purchase: true })
  ].join("\n"));

  const dataset = await buildRobovacDataset({
    metaFiles: [metaFile],
    reviewFiles: [reviewsFile],
    productLimit: 2,
    reviewLimit: 1
  });

  assert.deepEqual(dataset.products.map((product) => product.id), ["A2", "A3"]);
  assert.equal(dataset.reviews.length, 2);
  assert.equal(dataset.reviews.find((review) => review.productId === "A2").title, "Most helpful");
  assert.equal(dataset.groups[0].productIds.length, 2);
});
