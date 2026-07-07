import test from "node:test";
import assert from "node:assert/strict";
import { formatReportAsMarkdown } from "../src/shared/reportFormatter.js";

test("formatReportAsMarkdown renders the report modules as copyable Chinese markdown", () => {
  const markdown = formatReportAsMarkdown({
    overview: "市场概览",
    purchaseMotivations: ["省时", "宠物毛发"],
    painPoints: [{ theme: "地图稳定性", evidence: "地图丢失", implication: "强调稳定建图" }],
    opportunityMatrix: [{ opportunity: "宠物家庭", painPoint: "毛发缠绕", priority: "高", action: "主打防缠绕" }],
    positioningAdvice: ["低维护定位"],
    gtmActions: ["优化 Listing 首屏"]
  });

  assert.match(markdown, /^# Amazon 扫地机器人竞品机会报告/);
  assert.match(markdown, /## 市场与竞品概览/);
  assert.match(markdown, /- 省时/);
  assert.match(markdown, /### 地图稳定性/);
  assert.match(markdown, /\| 宠物家庭 \| 毛发缠绕 \| 高 \| 主打防缠绕 \|/);
});
