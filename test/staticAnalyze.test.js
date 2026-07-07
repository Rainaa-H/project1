import test from "node:test";
import assert from "node:assert/strict";
import { analyzeReport } from "../src/shared/analyzeReport.js";

test("analyzeReport falls back to local report generation when the API is unavailable", async () => {
  const result = await analyzeReport(
    {
      competitorGroup: "宠物家庭清洁场景",
      products: [
        {
          brand: "Eufy",
          name: "Eufy RoboVac X8 Hybrid",
          price: 399,
          rating: 4.3,
          features: ["宠物毛发", "防缠绕", "扫拖一体", "低维护"]
        }
      ],
      reviews: [
        {
          title: "Great for pet hair",
          text: "It keeps pet hair under control but the brush still needs maintenance.",
          rating: 4,
          helpfulVote: 20
        }
      ],
      language: "zh-CN"
    },
    async () => {
      throw new Error("GitHub Pages has no API server");
    }
  );

  assert.equal(result.source, "static-fallback");
  assert.match(result.report.overview, /宠物家庭清洁场景/);
  assert.match(result.report.opportunityMatrix[0].opportunity, /宠物|毛发/);
});
