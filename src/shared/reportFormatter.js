export function formatReportAsMarkdown(report) {
  if (!report) return "";

  return [
    "# Amazon 扫地机器人竞品机会报告",
    "",
    "## 市场与竞品概览",
    report.overview || "",
    "",
    "## 用户购买动机",
    list(report.purchaseMotivations),
    "",
    "## 高频差评痛点",
    (report.painPoints || []).map((point) => [
      `### ${point.theme}`,
      point.evidence || "",
      point.implication ? `建议：${point.implication}` : ""
    ].filter(Boolean).join("\n")).join("\n\n"),
    "",
    "## 机会矩阵",
    "| 机会点 | 用户痛点 | 优先级 | 建议动作 |",
    "|---|---|---|---|",
    ...(report.opportunityMatrix || []).map((item) =>
      `| ${item.opportunity || ""} | ${item.painPoint || ""} | ${item.priority || ""} | ${item.action || ""} |`
    ),
    "",
    "## 差异化定位建议",
    list(report.positioningAdvice),
    "",
    "## Listing/GTM 行动建议",
    list(report.gtmActions)
  ].join("\n").trim();
}

function list(items = []) {
  return items.map((item) => `- ${item}`).join("\n");
}
