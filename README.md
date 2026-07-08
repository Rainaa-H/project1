# RoboVac Market Intel

AI 扫地机器人竞品机会报告生成器。面向跨境电商品牌和 GTM 人员，基于 Amazon 扫地机器人样例商品与评论，生成中文竞品机会报告。

## Run

```powershell
# API
& 'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' server/index.js

# Frontend
& 'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' node_modules/vite/bin/vite.js --host 127.0.0.1
```

Open `http://127.0.0.1:5173`.

## Live Amazon import

The browser UI can import live Amazon product and review data through the Express API endpoint `POST /api/amazon/import`.

Runtime requirements:

```powershell
pnpm add amazon-buddy@^2.2.44
$env:AMAZON_COUNTRY = "US"
$env:AMAZON_MAX_PRODUCTS = "10"
$env:AMAZON_MAX_REVIEWS_PER_ASIN = "50"
$env:AMAZON_REQUEST_TIMEOUT_MS = "30000"
```

For a deployed static frontend, set `VITE_API_BASE_URL` to the hosted Express API origin before building. GitHub Pages alone cannot run the Amazon import backend.

## Optional LLM

默认无 API key 时使用 Demo fallback 报告。若使用 OpenAI 兼容 Chat Completions，可只设置 `OPENAI_API_KEY`，默认请求 `https://api.openai.com/v1/chat/completions`。

```powershell
$env:OPENAI_API_KEY = "your-key"
$env:LLM_MODEL = "gpt-4o-mini"
```

若要接入其他兼容 endpoint，设置：

```powershell
$env:LLM_API_URL = "https://your-llm-endpoint"
$env:LLM_API_KEY = "your-key"
$env:LLM_MODEL = "your-model"
```

## Amazon Reviews 2023 data extraction

Amazon Reviews 2023 does not provide a direct sales field. For a reproducible proxy, the extractor ranks robot vacuum products by `rating_number` and then selects each product's top reviews by `helpful_vote` / `helpful_votes`.

Download the relevant `meta_*.jsonl.gz` and review `*.jsonl.gz` files for `Appliances` and/or `Home_and_Kitchen`, then run:

```powershell
& 'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' scripts/buildRobovacDataset.mjs `
  --meta path/to/meta_Appliances.jsonl.gz `
  --reviews path/to/Appliances.jsonl.gz `
  --out data/robovac-amazon-reviews.json `
  --products 50 `
  --reviews-per-product 50
```

The output contains 50 robot vacuum products and up to 50 helpful reviews per product, depending on how many matching reviews are present in the downloaded category files.

## Tests

```powershell
& 'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' test/parsers.test.js
& 'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' test/reportEngine.test.js
& 'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' test/api.test.js
```
