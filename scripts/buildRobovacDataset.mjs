import { createReadStream } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { createGunzip } from "node:zlib";
import { createInterface } from "node:readline/promises";

const ROBOVAC_KEYWORDS = [
  "robot vacuum",
  "robotic vacuum",
  "vacuum mop",
  "roomba",
  "robovac",
  "deebot",
  "roborock",
  "ecovacs",
  "self-emptying",
  "self emptying"
];

export function isRobovacProduct(meta) {
  const haystack = [
    meta.title,
    meta.name,
    meta.store,
    ...(Array.isArray(meta.features) ? meta.features : []),
    ...(Array.isArray(meta.description) ? meta.description : [meta.description]),
    ...(Array.isArray(meta.categories) ? meta.categories.flat(Infinity) : [])
  ].filter(Boolean).join(" ").toLowerCase();

  const hasRobotVacuumSignal = ROBOVAC_KEYWORDS.some((keyword) => haystack.includes(keyword));
  const genericStickVacuum = /stick vacuum|cordless vacuum|upright vacuum|handheld vacuum/.test(haystack);
  return hasRobotVacuumSignal && !genericStickVacuum;
}

export async function buildRobovacDataset({ metaFiles, reviewFiles, productLimit = 50, reviewLimit = 50 }) {
  const candidates = [];

  for (const file of metaFiles) {
    for await (const meta of readJsonLines(file)) {
      if (!isRobovacProduct(meta)) continue;
      const id = getProductId(meta);
      if (!id) continue;
      candidates.push(toProduct(meta, id));
    }
  }

  const products = dedupeProducts(candidates)
    .sort((a, b) => b.heatScore - a.heatScore)
    .slice(0, productLimit);
  const productIds = new Set(products.map((product) => product.id));
  const reviewsByProduct = new Map(products.map((product) => [product.id, []]));

  for (const file of reviewFiles) {
    for await (const review of readJsonLines(file)) {
      const productId = review.parent_asin || review.asin;
      if (!productIds.has(productId)) continue;
      reviewsByProduct.get(productId).push(toReview(review, productId));
    }
  }

  const reviews = products.flatMap((product) =>
    (reviewsByProduct.get(product.id) || [])
      .sort((a, b) => b.helpfulVote - a.helpfulVote)
      .slice(0, reviewLimit)
  );

  return {
    source: "Amazon Reviews 2023",
    ranking: "products sorted by rating_number as a sales/market-heat proxy; reviews sorted by helpful_votes",
    generatedAt: new Date().toISOString(),
    products,
    reviews,
    groups: [
      {
        id: "amazon-reviews-2023-top-robovacs",
        name: "Amazon Reviews 2023 扫地机器人热度 Top 50",
        description: "按 rating_number 作为市场热度代理排序；每个商品保留 helpful_votes 最高的 50 条评论。",
        productIds: products.map((product) => product.id)
      }
    ]
  };
}

async function* readJsonLines(file) {
  const input = file.endsWith(".gz")
    ? createReadStream(file).pipe(createGunzip())
    : createReadStream(file);
  const rl = createInterface({ input, crlfDelay: Infinity });

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    yield JSON.parse(trimmed);
  }
}

function toProduct(meta, id) {
  const ratingNumber = Number(meta.rating_number || meta.ratingNumber || meta.review_count || 0);
  return {
    id,
    brand: meta.store || meta.brand || "Unknown",
    name: meta.title || meta.name || id,
    price: normalizePrice(meta.price),
    rating: Number(meta.average_rating || meta.rating || 0),
    reviewCount: ratingNumber,
    heatScore: ratingNumber,
    category: "Robot Vacuum",
    features: normalizeFeatures(meta.features),
    sourceAsin: id
  };
}

function toReview(review, productId) {
  return {
    productId,
    title: review.title || "Amazon review",
    text: review.text || "",
    rating: Number(review.rating || 0),
    verifiedPurchase: Boolean(review.verified_purchase),
    helpfulVote: Number(review.helpful_vote || review.helpful_votes || 0),
    date: normalizeDate(review.timestamp)
  };
}

function dedupeProducts(products) {
  const byId = new Map();
  for (const product of products) {
    const existing = byId.get(product.id);
    if (!existing || product.heatScore > existing.heatScore) byId.set(product.id, product);
  }
  return [...byId.values()];
}

function getProductId(meta) {
  return meta.parent_asin || meta.asin;
}

function normalizePrice(price) {
  const value = Number(String(price || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(value) ? value : 0;
}

function normalizeFeatures(features) {
  if (Array.isArray(features) && features.length) return features.slice(0, 6).map(String);
  return ["Robot vacuum", "Amazon Reviews 2023", "Review-derived sample", "Competitive analysis"];
}

function normalizeDate(timestamp) {
  if (!timestamp) return "";
  const number = Number(timestamp);
  if (!Number.isFinite(number)) return String(timestamp);
  return new Date(number).toISOString().slice(0, 10);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.meta.length || !args.reviews.length) {
    console.error("Usage: node scripts/buildRobovacDataset.mjs --meta meta.jsonl.gz --reviews reviews.jsonl.gz --out data/robovac-amazon-reviews.json");
    process.exit(1);
  }

  const dataset = await buildRobovacDataset({
    metaFiles: args.meta,
    reviewFiles: args.reviews,
    productLimit: args.products,
    reviewLimit: args.reviewsPerProduct
  });

  await mkdir(dirname(args.out), { recursive: true });
  await writeFile(args.out, `${JSON.stringify(dataset, null, 2)}\n`, "utf8");
  console.log(`Wrote ${dataset.products.length} products and ${dataset.reviews.length} reviews to ${args.out}`);
}

function parseArgs(argv) {
  const args = {
    meta: [],
    reviews: [],
    out: "data/robovac-amazon-reviews.json",
    products: 50,
    reviewsPerProduct: 50
  };

  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    const value = argv[index + 1];
    if (key === "--meta") {
      args.meta.push(value);
      index += 1;
    } else if (key === "--reviews") {
      args.reviews.push(value);
      index += 1;
    } else if (key === "--out") {
      args.out = value;
      index += 1;
    } else if (key === "--products") {
      args.products = Number(value);
      index += 1;
    } else if (key === "--reviews-per-product") {
      args.reviewsPerProduct = Number(value);
      index += 1;
    }
  }

  return args;
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}`) {
  main();
}
