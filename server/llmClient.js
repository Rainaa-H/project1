import { generateFallbackReport } from "./reportEngineDynamic.js";

export async function generateReport(request) {
  const apiKey = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY;
  const apiUrl = process.env.LLM_API_URL || (process.env.OPENAI_API_KEY ? "https://api.openai.com/v1/chat/completions" : "");

  if (!apiKey || !apiUrl) {
    return { source: "fallback", report: generateFallbackReport(request) };
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.LLM_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "你是跨境电商 GTM 竞品分析顾问。只输出严格 JSON，不要 Markdown。"
          },
          {
            role: "user",
            content: buildPrompt(request)
          }
        ],
        temperature: 0.4
      })
    });

    if (!response.ok) throw new Error(`LLM API returned ${response.status}`);
    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content;
    if (!content) throw new Error("LLM API response has no message content");

    return { source: "llm", report: JSON.parse(content) };
  } catch (error) {
    return {
      source: "fallback",
      warning: `LLM 调用失败，已使用 Demo 报告：${error.message}`,
      report: generateFallbackReport(request)
    };
  }
}

function buildPrompt(request) {
  return JSON.stringify({
    instruction: "基于扫地机器人竞品商品和评论，生成中文 OpportunityReport JSON，字段必须包括 language, overview, purchaseMotivations, painPoints, competitorSellingPoints, opportunityMatrix, positioningAdvice, gtmActions。",
    request
  });
}
