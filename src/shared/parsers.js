export function parseReviewText(input) {
  return String(input || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((text, index) => ({
      title: `粘贴评论 ${index + 1}`,
      text,
      rating: 3,
      verifiedPurchase: false,
      helpfulVote: 0,
      date: ""
    }));
}

export function parseReviewCsv(input) {
  const rows = parseCsvRows(String(input || ""));
  if (rows.length < 2) return [];

  const headers = rows[0].map((header) => normalizeHeader(header));
  return rows.slice(1).filter((row) => row.some((cell) => cell.trim())).map((row, index) => {
    const record = Object.fromEntries(headers.map((header, cellIndex) => [header, row[cellIndex] || ""]));
    const text = firstValue(record, ["text", "review_text", "body", "content", "评论正文"]);
    const title = firstValue(record, ["title", "review_title", "summary", "评论标题"]) || `CSV 评论 ${index + 1}`;

    return {
      title,
      text,
      rating: toNumber(firstValue(record, ["rating", "stars", "score", "评分"]), 3),
      verifiedPurchase: toBoolean(firstValue(record, ["verified_purchase", "verified", "是否验证购买"])),
      helpfulVote: toNumber(firstValue(record, ["helpful_vote", "helpful", "votes", "helpful_votes"]), 0),
      date: firstValue(record, ["date", "review_date", "timestamp", "日期"])
    };
  }).filter((record) => record.text || record.title);
}

function parseCsvRows(input) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell.trim());
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell.trim());
  rows.push(row);
  return rows.filter((cells) => cells.some(Boolean));
}

function normalizeHeader(value) {
  return String(value || "").trim().toLowerCase();
}

function firstValue(record, keys) {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== "") return record[key];
  }
  return "";
}

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBoolean(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return ["true", "1", "yes", "y", "verified", "是"].includes(normalized);
}
