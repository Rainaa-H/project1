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
