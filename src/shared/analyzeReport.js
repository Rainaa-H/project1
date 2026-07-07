import { generateFallbackReport } from "../../server/reportEngineDynamic.js";

export async function analyzeReport(request, fetchImpl = fetch) {
  try {
    const response = await fetchImpl("/api/analyze", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(request)
    });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || "生成失败，请检查输入。");
    return body;
  } catch (error) {
    return {
      source: "static-fallback",
      warning: "当前页面运行在静态托管环境，已使用浏览器本地 Demo 分析引擎生成报告。",
      report: generateFallbackReport(request)
    };
  }
}
