import test from "node:test";
import assert from "node:assert/strict";
import { importAmazonDataset, validateAmazonImportRequest } from "../server/amazonImport.js";

test("validateAmazonImportRequest rejects empty keywords", () => {
  assert.equal(validateAmazonImportRequest({ keyword: "" }), "keyword or asins is required");
  assert.equal(validateAmazonImportRequest({ keyword: "robot vacuum" }), "");
  assert.equal(validateAmazonImportRequest({ asins: "B0C7VLHMQR" }), "");
});

test("importAmazonDataset maps Amazon products and reviews into analysis data", async () => {
  const calls = [];
  const client = {
    async products(request) {
      calls.push(["products", request]);
      return {
        result: [
          {
            asin: "B001",
            title: "Eufy Robot Vacuum",
            brand: "Eufy",
            price: "$249.99",
            rating: "4.4 out of 5",
            reviews_count: "1,234",
            feature_bullets: ["Quiet cleaning", "Pet hair pickup"],
            url: "https://amazon.example/B001"
          }
        ]
      };
    },
    async reviews(request) {
      calls.push(["reviews", request]);
      return {
        result: [
          {
            title: "Good for pet hair",
            body: "It handles dog hair well but needs brush cleaning.",
            rating: "4.0",
            verified_purchase: true,
            helpful_vote: "12",
            date: "2026-01-03"
          }
        ]
      };
    }
  };

  const dataset = await importAmazonDataset(
    { keyword: "robot vacuum", country: "us", maxProducts: 1, maxReviewsPerProduct: 1 },
    { client }
  );

  assert.equal(dataset.source, "amazon-buddy");
  assert.equal(dataset.products.length, 1);
  assert.equal(dataset.products[0].id, "B001");
  assert.equal(dataset.products[0].price, 249.99);
  assert.equal(dataset.products[0].reviewCount, 1234);
  assert.deepEqual(dataset.products[0].features, ["Quiet cleaning", "Pet hair pickup"]);
  assert.equal(dataset.reviews.length, 1);
  assert.equal(dataset.reviews[0].productId, "B001");
  assert.equal(dataset.reviews[0].verifiedPurchase, true);
  assert.equal(dataset.groups[0].productIds[0], "B001");
  assert.deepEqual(calls[0], ["products", { keyword: "robot vacuum", country: "US", number: 1 }]);
  assert.deepEqual(calls[1], ["reviews", { asin: "B001", country: "US", number: 1 }]);
});

test("importAmazonDataset returns warnings when one product review import fails", async () => {
  const client = {
    async products() {
      return [
        { asin: "B001", title: "Working Robot Vacuum" },
        { asin: "B002", title: "Failing Robot Vacuum" }
      ];
    },
    async reviews(request) {
      if (request.asin === "B002") throw new Error("blocked");
      return [{ title: "Works", body: "Works well.", rating: 5 }];
    }
  };

  const dataset = await importAmazonDataset({ keyword: "robot vacuum" }, { client });

  assert.equal(dataset.products.length, 2);
  assert.equal(dataset.reviews.length, 2);
  assert.equal(dataset.warnings.length, 1);
  assert.match(dataset.warnings[0], /B002/);
  assert.match(dataset.warnings[0], /blocked/);
});

test("importAmazonDataset rejects empty upstream product results", async () => {
  const client = {
    async products() {
      return { totalProducts: "8240", result: [] };
    },
    async reviews() {
      return [];
    }
  };

  await assert.rejects(
    () => importAmazonDataset({ keyword: "robot vacuum" }, { client }),
    /returned no products/
  );
});

test("importAmazonDataset can import products by ASIN and use listing evidence when reviews are empty", async () => {
  const calls = [];
  const client = {
    async asin(request) {
      calls.push(["asin", request]);
      return {
        result: [
          {
            title: "Roborock Q5 Pro Robot Vacuum and Mop",
            asin: request.asin,
            feature_bullets: ["5500Pa suction", "LiDAR navigation"],
            reviews: { rating: 4.5, total_reviews: 1200 }
          }
        ]
      };
    },
    async reviews(request) {
      calls.push(["reviews", request]);
      return { result: [] };
    }
  };

  const dataset = await importAmazonDataset(
    { asins: "B0C7VLHMQR", country: "US", maxProducts: 1, maxReviewsPerProduct: 3 },
    { client }
  );

  assert.equal(dataset.products.length, 1);
  assert.equal(dataset.products[0].asin, "B0C7VLHMQR");
  assert.equal(dataset.products[0].rating, 4.5);
  assert.equal(dataset.products[0].reviewCount, 1200);
  assert.equal(dataset.reviews.length, 1);
  assert.equal(dataset.reviews[0].title, "Amazon listing evidence");
  assert.match(dataset.reviews[0].text, /5500Pa suction/);
  assert.match(dataset.warnings[0], /No Amazon reviews returned/);
  assert.deepEqual(calls[0], ["asin", { asin: "B0C7VLHMQR", country: "US" }]);
});

test("importAmazonDataset accepts Chinese punctuation between ASINs", async () => {
  const calls = [];
  const client = {
    async asin(request) {
      calls.push(request.asin);
      return { result: [{ title: `Product ${request.asin}`, asin: request.asin, feature_bullets: ["LiDAR"] }] };
    },
    async reviews() {
      return { result: [] };
    }
  };

  const dataset = await importAmazonDataset(
    { asins: "B0DFZ2HMY8?B0GD1XTMFN、B0G5YDVR99", maxProducts: 10 },
    { client }
  );

  assert.deepEqual(calls, ["B0DFZ2HMY8", "B0GD1XTMFN", "B0G5YDVR99"]);
  assert.deepEqual(dataset.products.map((product) => product.asin), calls);
});
