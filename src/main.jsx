import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { BarChart3, Clipboard, Copy, FileUp, Lightbulb, Loader2, Target, Upload } from "lucide-react";
import { importAmazonDataset } from "./shared/amazonImport.js";
import { analyzeReport } from "./shared/analyzeReport.js";
import { parseReviewCsv, parseReviewText } from "./shared/parsers.js";
import { formatReportAsMarkdown } from "./shared/reportFormatter.js";
import { sampleCompetitorGroups, sampleProducts, sampleReviews } from "./shared/sampleData.js";
import "./styles.css";

function App() {
  const [marketData, setMarketData] = useState({
    groups: sampleCompetitorGroups,
    products: sampleProducts,
    reviews: sampleReviews,
    source: "sample"
  });
  const [selectedGroupId, setSelectedGroupId] = useState(sampleCompetitorGroups[0].id);
  const [pasteText, setPasteText] = useState("");
  const [customReviews, setCustomReviews] = useState([]);
  const [amazonForm, setAmazonForm] = useState({
    keyword: "robot vacuum",
    country: "US",
    maxProducts: 10,
    maxReviewsPerProduct: 50
  });
  const [amazonState, setAmazonState] = useState({ status: "idle", error: "", warnings: [] });
  const [reportState, setReportState] = useState({ status: "idle", report: null, error: "", source: "" });

  const selectedGroup = marketData.groups.find((group) => group.id === selectedGroupId) || marketData.groups[0] || sampleCompetitorGroups[0];
  const selectedProducts = useMemo(
    () => marketData.products.filter((product) => selectedGroup.productIds.includes(product.id)),
    [marketData.products, selectedGroup]
  );
  const selectedReviews = useMemo(() => {
    const reviewPool = customReviews.length ? customReviews : marketData.reviews;
    const productIds = new Set(selectedProducts.map((product) => product.id));
    const scoped = reviewPool.filter((review) => !review.productId || productIds.has(review.productId));
    return scoped.length ? scoped : reviewPool;
  }, [customReviews, marketData.reviews, selectedProducts]);
  const stats = useMemo(() => summarize(selectedProducts, selectedReviews), [selectedProducts, selectedReviews]);

  async function analyze() {
    if (!selectedReviews.length) {
      setReportState({ status: "error", report: null, error: "至少需要 1 条评论才能生成报告。", source: "" });
      return;
    }

    setReportState({ status: "loading", report: null, error: "", source: "" });
    try {
      const body = await analyzeReport({
        competitorGroup: selectedGroup.name,
        products: selectedProducts,
        reviews: selectedReviews,
        language: "zh-CN"
      });
      setReportState({ status: "ready", report: body.report, error: body.warning || "", source: body.source });
    } catch (error) {
      setReportState({ status: "error", report: null, error: error.message, source: "" });
    }
  }

  function handlePasteParse() {
    const records = parseReviewText(pasteText);
    setCustomReviews(records);
    setReportState({ status: "idle", report: null, error: "", source: "" });
  }

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setCustomReviews(parseReviewCsv(text));
    setPasteText("");
    setReportState({ status: "idle", report: null, error: "", source: "" });
  }

  async function handleAmazonImport() {
    setAmazonState({ status: "loading", error: "", warnings: [] });
    try {
      const dataset = await importAmazonDataset({
        keyword: amazonForm.keyword,
        country: amazonForm.country,
        maxProducts: Number(amazonForm.maxProducts),
        maxReviewsPerProduct: Number(amazonForm.maxReviewsPerProduct)
      });
      const groups = dataset.groups?.length ? dataset.groups : sampleCompetitorGroups;
      setMarketData({
        groups,
        products: dataset.products || [],
        reviews: dataset.reviews || [],
        source: dataset.source || "amazon-buddy"
      });
      setSelectedGroupId(groups[0].id);
      setCustomReviews([]);
      setPasteText("");
      setReportState({ status: "idle", report: null, error: "", source: "" });
      setAmazonState({ status: "ready", error: "", warnings: dataset.warnings || [] });
    } catch (error) {
      setAmazonState({ status: "error", error: error.message, warnings: [] });
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">AI Competitive Intelligence</p>
          <h1>RoboVac Market Intel</h1>
        </div>
        <button className="primary-button" onClick={analyze} disabled={reportState.status === "loading"}>
          {reportState.status === "loading" ? <Loader2 className="spin" size={18} /> : <Lightbulb size={18} />}
          生成机会报告
        </button>
      </header>

      <section className="workspace">
        <aside className="panel controls" aria-label="分析输入">
          <SectionTitle icon={<Upload size={18} />} title="Amazon 数据导入" />
          <div className="amazon-import">
            <label>
              关键词
              <input
                value={amazonForm.keyword}
                onChange={(event) => setAmazonForm({ ...amazonForm, keyword: event.target.value })}
                placeholder="robot vacuum"
              />
            </label>
            <div className="field-grid">
              <label>
                国家
                <input
                  value={amazonForm.country}
                  onChange={(event) => setAmazonForm({ ...amazonForm, country: event.target.value.toUpperCase() })}
                  maxLength={2}
                />
              </label>
              <label>
                商品
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={amazonForm.maxProducts}
                  onChange={(event) => setAmazonForm({ ...amazonForm, maxProducts: event.target.value })}
                />
              </label>
              <label>
                评论/商品
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={amazonForm.maxReviewsPerProduct}
                  onChange={(event) => setAmazonForm({ ...amazonForm, maxReviewsPerProduct: event.target.value })}
                />
              </label>
            </div>
            <button className="secondary-button" onClick={handleAmazonImport} disabled={amazonState.status === "loading"}>
              {amazonState.status === "loading" ? <Loader2 className="spin" size={17} /> : <Upload size={17} />}
              导入 Amazon 数据
            </button>
            <p className="hint">数据源：{marketData.source === "sample" ? "内置 Demo 样例" : marketData.source}</p>
            {amazonState.error && <p className="error compact">{amazonState.error}</p>}
            {amazonState.warnings.map((warning) => <p className="warning compact" key={warning}>{warning}</p>)}
          </div>

          <SectionTitle icon={<Target size={18} />} title="竞品组" />
          <div className="group-list">
            {marketData.groups.map((group) => (
              <button
                className={group.id === selectedGroupId ? "group-option active" : "group-option"}
                key={group.id}
                onClick={() => {
                  setSelectedGroupId(group.id);
                  setReportState({ status: "idle", report: null, error: "", source: "" });
                }}
              >
                <strong>{group.name}</strong>
                <span>{group.description}</span>
              </button>
            ))}
          </div>

          <SectionTitle icon={<Upload size={18} />} title="自定义评论" />
          <label className="file-button">
            <FileUp size={17} />
            上传 CSV
            <input type="file" accept=".csv,text/csv" onChange={handleFile} />
          </label>
          <textarea
            value={pasteText}
            onChange={(event) => setPasteText(event.target.value)}
            placeholder="也可以逐行粘贴评论，每行一条。"
          />
          <button className="secondary-button" onClick={handlePasteParse}>解析粘贴评论</button>
          <p className="hint">当前使用 {customReviews.length ? customReviews.length : selectedReviews.length} 条评论。</p>
        </aside>

        <section className="panel intelligence" aria-label="竞品概览">
          <SectionTitle icon={<BarChart3 size={18} />} title="商品与评论概览" />
          <div className="metrics">
            <Metric label="代表商品" value={selectedProducts.length} />
            <Metric label="均价" value={`$${stats.averagePrice}`} />
            <Metric label="平均评分" value={stats.averageRating} />
            <Metric label="评论样例" value={selectedReviews.length} />
          </div>

          <div className="product-list">
            {selectedProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div>
                  <p>{product.brand}</p>
                  <h2>{product.name}</h2>
                </div>
                <div className="product-stats">
                  <span>${product.price}</span>
                  <span>{product.rating} 分</span>
                  <span>{product.reviewCount.toLocaleString()} reviews</span>
                </div>
                <div className="tags">
                  {product.features.map((feature) => <span key={feature}>{feature}</span>)}
                </div>
              </article>
            ))}
          </div>

          <div className="review-strip">
            {selectedReviews.slice(0, 4).map((review, index) => (
              <blockquote key={`${review.title}-${index}`}>
                <strong>{review.title}</strong>
                <span>{review.text}</span>
              </blockquote>
            ))}
          </div>
        </section>

        <section className="panel report" aria-label="AI 机会报告">
          <SectionTitle icon={<Clipboard size={18} />} title="中文机会报告" />
          {reportState.status === "idle" && <EmptyReport />}
          {reportState.status === "loading" && <LoadingReport />}
          {reportState.status === "error" && <p className="error">{reportState.error}</p>}
          {reportState.status === "ready" && (
            <ReportView report={reportState.report} source={reportState.source} warning={reportState.error} />
          )}
        </section>
      </section>
    </main>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <div className="section-title">
      {icon}
      <h2>{title}</h2>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function EmptyReport() {
  return (
    <div className="empty-report">
      <Lightbulb size={32} />
      <p>选择竞品组或上传评论后，点击生成报告。</p>
    </div>
  );
}

function LoadingReport() {
  return (
    <div className="empty-report">
      <Loader2 className="spin" size={32} />
      <p>正在把评论转成 GTM 机会洞察...</p>
    </div>
  );
}

function ReportView({ report, source, warning }) {
  const [copied, setCopied] = useState(false);

  async function copyReport() {
    await navigator.clipboard.writeText(formatReportAsMarkdown(report));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="report-content">
      <div className="report-actions">
        <div className="source-pill">{source === "llm" ? "LLM 生成" : "Demo fallback 报告"}</div>
        <button className="icon-button" onClick={copyReport} title="复制 Markdown 报告">
          <Copy size={16} />
          {copied ? "已复制" : "复制"}
        </button>
      </div>
      {warning && <p className="warning">{warning}</p>}
      <ReportSection title="市场与竞品概览">
        <p>{report.overview}</p>
      </ReportSection>
      <ReportSection title="用户购买动机">
        <ul>{report.purchaseMotivations.map((item) => <li key={item}>{item}</li>)}</ul>
      </ReportSection>
      <ReportSection title="高频差评痛点">
        {report.painPoints.map((point) => (
          <article className="mini-card" key={point.theme}>
            <strong>{point.theme}</strong>
            <span>{point.evidence}</span>
            <em>{point.implication}</em>
          </article>
        ))}
      </ReportSection>
      <ReportSection title="机会矩阵">
        <div className="matrix">
          {report.opportunityMatrix.map((item) => (
            <article key={item.opportunity}>
              <strong>{item.opportunity}</strong>
              <span>{item.painPoint}</span>
              <small>{item.priority}</small>
              <p>{item.action}</p>
            </article>
          ))}
        </div>
      </ReportSection>
      <ReportSection title="差异化定位建议">
        <ul>{report.positioningAdvice.map((item) => <li key={item}>{item}</li>)}</ul>
      </ReportSection>
      <ReportSection title="Listing/GTM 行动建议">
        <ol>{report.gtmActions.map((item) => <li key={item}>{item}</li>)}</ol>
      </ReportSection>
    </div>
  );
}

function ReportSection({ title, children }) {
  return (
    <section className="report-section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function summarize(products, reviews) {
  const averagePrice = average(products.map((product) => product.price));
  const averageRating = average(products.map((product) => product.rating));
  return {
    averagePrice: Math.round(averagePrice || 0),
    averageRating: (averageRating || 0).toFixed(1),
    reviews: reviews.length
  };
}

function average(values) {
  const valid = values.map(Number).filter(Number.isFinite);
  if (!valid.length) return 0;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

createRoot(document.getElementById("root")).render(<App />);
