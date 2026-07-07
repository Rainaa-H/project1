import test from "node:test";
import assert from "node:assert/strict";
import { generateReport } from "../server/llmClient.js";

test("generateReport uses the default OpenAI chat completions endpoint when OPENAI_API_KEY is set", async () => {
  const originalFetch = globalThis.fetch;
  const originalOpenAiKey = process.env.OPENAI_API_KEY;
  const originalLlmUrl = process.env.LLM_API_URL;
  const originalLlmKey = process.env.LLM_API_KEY;

  delete process.env.LLM_API_URL;
  delete process.env.LLM_API_KEY;
  process.env.OPENAI_API_KEY = "test-key";

  let calledUrl = "";
  let authorization = "";
  globalThis.fetch = async (url, options) => {
    calledUrl = url;
    authorization = options.headers.authorization;
    return {
      ok: true,
      async json() {
        return {
          choices: [
            {
              message: {
                content: JSON.stringify({
                  language: "zh-CN",
                  overview: "测试概览",
                  purchaseMotivations: ["省时"],
                  painPoints: [],
                  competitorSellingPoints: [],
                  opportunityMatrix: [],
                  positioningAdvice: [],
                  gtmActions: []
                })
              }
            }
          ]
        };
      }
    };
  };

  try {
    const result = await generateReport({
      competitorGroup: "扫地机器人",
      products: [],
      reviews: [{ title: "Quiet", text: "Quiet cleaning", rating: 4 }],
      language: "zh-CN"
    });

    assert.equal(result.source, "llm");
    assert.equal(calledUrl, "https://api.openai.com/v1/chat/completions");
    assert.equal(authorization, "Bearer test-key");
  } finally {
    globalThis.fetch = originalFetch;
    process.env.OPENAI_API_KEY = originalOpenAiKey;
    process.env.LLM_API_URL = originalLlmUrl;
    process.env.LLM_API_KEY = originalLlmKey;
  }
});
