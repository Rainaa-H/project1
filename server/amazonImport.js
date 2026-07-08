const DEFAULT_COUNTRY = process.env.AMAZON_COUNTRY || "US";
const DEFAULT_MAX_PRODUCTS = toPositiveInt(process.env.AMAZON_MAX_PRODUCTS, 10);
const DEFAULT_MAX_REVIEWS = toPositiveInt(process.env.AMAZON_MAX_REVIEWS_PER_ASIN, 50);
const DEFAULT_TIMEOUT_MS = toPositiveInt(process.env.AMAZON_REQUEST_TIMEOUT_MS, 30000);

export function validateAmazonImportRequest(request) {
  const keyword = String(request?.keyword || "").trim();
  if (!keyword) return "keyword is required";
  return "";
}

export async function importAmazonDataset(request, options = {}) {
  const error = validateAmazonImportRequest(request);
  if (error) throw new AmazonImportError(error, 400);

  const client = options.client || await loadAmazonClient();
  const country = normalizeCountry(request.country || DEFAULT_COUNTRY);
  const maxProducts = clamp(toPositiveInt(request.maxProducts, DEFAULT_MAX_PRODUCTS), 1, DEFAULT_MAX_PRODUCTS);
  const maxReviewsPerProduct = clamp(
    toPositiveInt(request.maxReviewsPerProduct, DEFAULT_MAX_REVIEWS),
    1,
    DEFAULT_MAX_REVIEWS
  );
  const timeoutMs = toPositiveInt(options.timeoutMs || process.env.AMAZON_REQUEST_TIMEOUT_MS, DEFAULT_TIMEOUT_MS);

  const rawProducts = unwrapAmazonResult(await withTimeout(
    client.products({ keyword: request.keyword.trim(), country, number: maxProducts }),
    timeoutMs,
    "Amazon product search timed out"
  )).slice(0, maxProducts);

  const products = rawProducts.map(normalizeProduct).filter((product) => product.id && product.name);
  const warnings = [];
  const reviews = [];

  for (const product of products) {
    try {
      if (!product.asin) continue;
      const rawReviews = unwrapAmazonResult(await withTimeout(
        client.reviews({ asin: product.asin, country, number: maxReviewsPerProduct }),
        timeoutMs,
        `Amazon reviews timed out for ${product.asin}`
      )).slice(0, maxReviewsPerProduct);
      reviews.push(...rawReviews.map((review, index) => normalizeReview(review, product, index)).filter(Boolean));
    } catch (error) {
      warnings.push(`Failed to import reviews for ${product.asin}: ${error.message}`);
    }
  }

  const group = {
    id: `amazon-${slugify(request.keyword) || "import"}`,
    name: `Amazon: ${request.keyword.trim()}`,
    description: `Imported ${products.length} products and ${reviews.length} reviews from Amazon ${country}.`,
    productIds: products.map((product) => product.id)
  };

  return {
    source: "amazon-buddy",
    products,
    reviews,
    groups: [group],
    warnings
  };
}

export class AmazonImportError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = "AmazonImportError";
    this.status = status;
  }
}

async function loadAmazonClient() {
  try {
    const module = await import("amazon-buddy");
    return module.default || module;
  } catch (error) {
    throw new AmazonImportError(
      "amazon-buddy is not installed. Run pnpm install before using Amazon import.",
      503
    );
  }
}

function normalizeProduct(product) {
  const asin = firstString(product.asin, product.ASIN, product.product_asin);
  const title = firstString(product.title, product.name, product.product_title);
  const price = normalizePrice(product.price, product.price_value, product.current_price, product.actual_price);
  const rating = normalizeNumber(product.reviews?.rating, product.rating, product.score, product.stars);
  const reviewCount = normalizeNumber(
    product.reviews?.total_reviews,
    product.reviews_count,
    product.total_reviews,
    product.ratings_total,
    product.reviewCount
  );

  return {
    id: asin || slugify(title),
    asin,
    brand: firstString(product.brand, product.manufacturer) || inferBrand(title),
    name: title,
    price,
    rating,
    reviewCount,
    category: firstString(product.category, product.type) || "Amazon Product",
    segment: inferSegment(price),
    features: buildFeatures(product),
    url: firstString(product.url, product.link, product.product_url),
    image: firstString(product.image, product.thumbnail, product.image_url)
  };
}

function normalizeReview(review, product, index) {
  const text = firstString(review.body, review.text, review.review, review.content, review.comment);
  const title = firstString(review.title, review.heading, review.summary) || `Amazon review ${index + 1}`;
  if (!text && !title) return null;

  return {
    productId: product.id,
    title,
    text: text || title,
    rating: normalizeNumber(review.rating, review.stars, review.score) || 0,
    verifiedPurchase: Boolean(review.verified_purchase ?? review.verifiedPurchase ?? review.verified),
    helpfulVote: normalizeNumber(review.helpful_vote, review.helpful_votes, review.helpfulVote) || 0,
    date: firstString(review.date, review.review_date, review.review_data, review.created_at)
  };
}

function unwrapAmazonResult(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.result)) return value.result;
  if (Array.isArray(value?.results)) return value.results;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.reviews)) return value.reviews;
  if (Array.isArray(value?.products)) return value.products;
  return [];
}

function buildFeatures(product) {
  const raw = [
    ...(Array.isArray(product.features) ? product.features : []),
    ...(Array.isArray(product.feature_bullets) ? product.feature_bullets : []),
    firstString(product.availability, product.shipping, product.badge)
  ].filter(Boolean);
  return raw.length ? raw.slice(0, 5).map(String) : ["Amazon listing", "Imported product"];
}

function inferBrand(title) {
  return firstString(title)?.split(/\s+/)[0] || "Amazon";
}

function inferSegment(price) {
  if (!price) return "unknown";
  if (price >= 650) return "premium";
  if (price >= 320) return "mid";
  return "budget";
}

function normalizeCountry(value) {
  return String(value || "US").trim().toUpperCase().slice(0, 2) || "US";
}

function normalizePrice(...values) {
  for (const value of values) {
    const number = normalizeNumber(typeof value === "object" ? value?.current_price ?? value?.value ?? value?.price : value);
    if (number) return number;
  }
  return 0;
}

function normalizeNumber(...values) {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    const parsed = Number(String(value || "").replace(/[^0-9.]+/g, ""));
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return 0;
}

function firstString(...values) {
  return values.find((value) => typeof value === "string" && value.trim())?.trim() || "";
}

function toPositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function slugify(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function withTimeout(promise, timeoutMs, message) {
  let timeout;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timeout = setTimeout(() => reject(new Error(message)), timeoutMs);
    })
  ]).finally(() => clearTimeout(timeout));
}
