import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../server/app.js";

function listen(app) {
  return new Promise((resolve) => {
    const server = app.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({ server, url: `http://127.0.0.1:${address.port}` });
    });
  });
}

test("POST /api/analyze rejects empty review input with a readable error", async () => {
  const { server, url } = await listen(createApp());
  try {
    const response = await fetch(`${url}/api/analyze`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ competitorGroup: "扫地机器人", products: [], reviews: [] })
    });

    assert.equal(response.status, 400);
    const body = await response.json();
    assert.match(body.error, /至少需要/i);
  } finally {
    server.close();
  }
});

test("POST /api/analyze returns a fallback report when no LLM key is configured", async () => {
  const { server, url } = await listen(createApp());
  try {
    const response = await fetch(`${url}/api/analyze`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        competitorGroup: "宠物家庭扫地机器人",
        products: [{ brand: "Eufy", name: "Eufy RoboVac", price: 249, rating: 4.2, reviewCount: 2200, features: ["低噪音"] }],
        reviews: [{ title: "Quiet", text: "Quiet but misses corners", rating: 3, verifiedPurchase: true, helpfulVote: 5 }],
        language: "zh-CN"
      })
    });

    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.source, "fallback");
    assert.ok(body.report.overview.includes("宠物家庭扫地机器人"));
  } finally {
    server.close();
  }
});

test("POST /api/amazon/import rejects empty keywords", async () => {
  const { server, url } = await listen(createApp());
  try {
    const response = await fetch(`${url}/api/amazon/import`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ keyword: "" })
    });

    assert.equal(response.status, 400);
    const body = await response.json();
    assert.equal(body.error, "keyword or asins is required");
  } finally {
    server.close();
  }
});

test("POST /api/amazon/import returns imported products and clamps limits", async () => {
  const seen = [];
  const amazonClient = {
    async products(request) {
      seen.push(["products", request]);
      return {
        result: [
          { asin: "B001", title: "Robot Vacuum One", price: "$199", rating: "4.1", reviews_count: "10" },
          { asin: "B002", title: "Robot Vacuum Two", price: "$399", rating: "4.5", reviews_count: "20" }
        ]
      };
    },
    async reviews(request) {
      seen.push(["reviews", request]);
      return [{ title: "Useful", body: "Useful robot vacuum.", rating: 4, verified_purchase: true }];
    }
  };
  const { server, url } = await listen(createApp({ amazonClient }));
  try {
    const response = await fetch(`${url}/api/amazon/import`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ keyword: "robot vacuum", country: "us", maxProducts: 99, maxReviewsPerProduct: 99 })
    });

    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.source, "amazon-buddy");
    assert.equal(body.products.length, 2);
    assert.equal(body.reviews.length, 2);
    assert.equal(body.groups[0].productIds.length, 2);
    assert.deepEqual(seen[0], ["products", { keyword: "robot vacuum", country: "US", number: 10 }]);
    assert.deepEqual(seen[1], ["reviews", { asin: "B001", country: "US", number: 50 }]);
  } finally {
    server.close();
  }
});
