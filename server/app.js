import express from "express";
import cors from "cors";
import { sampleCompetitorGroups, sampleProducts, sampleReviews } from "../src/shared/sampleData.js";
import { AmazonImportError, importAmazonDataset, validateAmazonImportRequest } from "./amazonImport.js";
import { generateReport } from "./llmClient.js";
import { validateAnalyzeRequest } from "./reportEngineDynamic.js";

export function createApp(options = {}) {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/samples", (_request, response) => {
    response.json({
      groups: sampleCompetitorGroups,
      products: sampleProducts,
      reviews: sampleReviews
    });
  });

  app.post("/api/amazon/import", async (request, response) => {
    const error = validateAmazonImportRequest(request.body);
    if (error) {
      response.status(400).json({ error });
      return;
    }

    try {
      const result = await importAmazonDataset(request.body, { client: options.amazonClient });
      response.json(result);
    } catch (error) {
      const status = error instanceof AmazonImportError ? error.status : 500;
      response.status(status).json({ error: error.message || "Amazon import failed" });
    }
  });

  app.post("/api/analyze", async (request, response) => {
    const error = validateAnalyzeRequest(request.body);
    if (error) {
      response.status(400).json({ error });
      return;
    }

    const result = await generateReport({
      competitorGroup: request.body.competitorGroup || "扫地机器人竞品组",
      products: Array.isArray(request.body.products) ? request.body.products : [],
      reviews: request.body.reviews,
      language: "zh-CN"
    });

    response.json(result);
  });

  return app;
}
