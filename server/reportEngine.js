const moduleTitles = {
  overview: "市场与竞品概览",
  purchaseMotivations: "用户购买动机",
  painPoints: "高频差评痛点",
  competitorSellingPoints: "竞品卖点拆解",
  opportunityMatrix: "机会矩阵",
  positioningAdvice: "差异化定位建议",
  gtmActions: "Listing/GTM 行动建议"
};

export function generateFallbackReport(request) {
  const products = Array.isArray(request.products) ? request.products : [];
  const reviews = Array.isArray(request.reviews) ? request.reviews : [];
  const group = request.competitorGroup || "扫地机器人竞品组";
  const brands = [...new Set(products.map((product) => product.brand).filter(Boolean))];
  const averagePrice = average(products.map((product) => product.price));
  const averageRating = average(products.map((product) => product.rating));
  const negativeThemes = detectThemes(reviews.filter((review) => Number(review.rating) <= 3));
  const positiveThemes = detectThemes(reviews.filter((review) => Number(review.rating) >= 4));

  return {
    language: "zh-CN",
    generatedAt: new Date().toISOString(),
    modules: moduleTitles,
    overview: `${group}覆盖 ${products.length || 1} 个代表商品，主要品牌包括${brands.join("、") || "iRobot、Roborock、Ecovacs、Shark、Eufy"}。样例均价约 $${Math.round(averagePrice || 559)}，平均评分约 ${(averageRating || 4.3).toFixed(1)}。市场卖点集中在自动集尘、扫拖一体、激光导航、宠物毛发清洁和 App 地图管理，但评论显示真实机会更多来自低维护、稳定建图和场景化易用体验。`,
    purchaseMotivations: [
      `希望减少日常清扫时间，尤其是宠物毛发、灰尘和厨房碎屑等高频场景。`,
      `愿意为自动集尘、扫拖一体和智能导航支付溢价，但前提是维护成本可控。`,
      `小户型和家庭用户更看重安静、易设置、少打扰，而不是单纯参数堆叠。`,
      ...positiveThemes.slice(0, 2).map((theme) => `正向评论反复提到“${theme.label}”，可作为核心转化卖点。`)
    ],
    painPoints: [
      {
        theme: "宠物毛发与长发缠绕",
        frequency: scoreTheme(negativeThemes, "毛发"),
        severity: "高",
        evidence: "用户常抱怨滚刷需要频繁清理，自动集尘袋也会快速装满。",
        implication: "宠物家庭不是泛泛强调强吸力，而是要证明防缠绕和低维护。"
      },
      {
        theme: "地图/App 稳定性",
        frequency: scoreTheme(negativeThemes, "App"),
        severity: "高",
        evidence: "差评集中在地图丢失、固件更新后重建地图、连接失败。",
        implication: "稳定性和简单控制可以成为对抗高端竞品复杂体验的切入点。"
      },
      {
        theme: "噪音与夜间打扰",
        frequency: scoreTheme(negativeThemes, "噪音"),
        severity: "中",
        evidence: "自清洁和自动集尘阶段噪音明显，家庭用户对婴儿、宠物和夜间场景敏感。",
        implication: "低噪音不能只写分贝，需要强调调度、静音模式和家庭场景。"
      },
      {
        theme: "售后与耗材成本",
        frequency: scoreTheme(negativeThemes, "售后"),
        severity: "中",
        evidence: "维修响应慢、耗材袋贵、配件更换不透明会削弱用户信任。",
        implication: "可用耗材包、延保和清晰维护成本提升转化信心。"
      }
    ],
    competitorSellingPoints: products.map((product) => ({
      brand: product.brand || "竞品",
      product: product.name || "扫地机器人",
      sellingPoints: product.features || ["自动清洁", "智能导航"],
      risk: inferProductRisk(product)
    })),
    opportunityMatrix: [
      {
        opportunity: "宠物家庭低维护清洁",
        painPoint: "毛发缠绕、集尘袋消耗快、滚刷难清理",
        competitorGap: "多数竞品强调吸力，较少把防缠绕和维护成本讲清楚。",
        priority: "高",
        action: "主打防缠绕滚刷、大容量集尘和 30 天低维护场景。"
      },
      {
        opportunity: "小户型静音易用",
        painPoint: "App 复杂、噪音大、设置门槛高",
        competitorGap: "高端机型功能多但学习成本高。",
        priority: "高",
        action: "强调一键建图、静音集尘、老人友好和小户型路径效率。"
      },
      {
        opportunity: "稳定地图与离线可用",
        painPoint: "地图丢失、连接失败、固件更新后体验波动",
        competitorGap: "竞品少把稳定性作为显性卖点。",
        priority: "中",
        action: "在 Listing 和广告里展示断网可清扫、地图备份和异常恢复。"
      },
      {
        opportunity: "透明售后与耗材包",
        painPoint: "维修慢、耗材贵、配件难找",
        competitorGap: "参数页通常弱化长期使用成本。",
        priority: "中",
        action: "推出首年耗材包、延保权益和可视化维护成本。"
      }
    ],
    positioningAdvice: [
      "不要与头部品牌硬拼“最强参数”，建议定位为“更懂宠物家庭和小户型的低维护扫拖机器人”。",
      "核心信息层级建议为：少缠绕、少倒尘、少噪音、少折腾，而不是先讲 Pa 吸力。",
      "用真实场景替代抽象功能词：猫砂、长发、地毯边缘、餐桌椅脚、夜间集尘。"
    ],
    gtmActions: [
      "Listing 首屏加入“宠物毛发低维护”“自动集尘静音调度”“地图稳定备份”等差异化卖点。",
      "广告素材拆成宠物家庭、小户型公寓、忙碌上班族三个场景包。",
      "评价运营重点追踪毛发缠绕、地图稳定和售后响应三类关键词。",
      "上线前用 20-30 个种子用户验证滚刷维护频率和 App 设置时长。"
    ]
  };
}

export function validateAnalyzeRequest(request) {
  const reviews = Array.isArray(request?.reviews) ? request.reviews : [];
  if (reviews.length < 1) {
    return "至少需要 1 条评论才能生成竞品机会报告。";
  }
  return "";
}

function detectThemes(reviews) {
  const dictionary = [
    { label: "宠物毛发", keys: ["pet", "hair", "dog", "cat", "毛发", "长发"] },
    { label: "地图/App", keys: ["map", "app", "connect", "firmware", "地图", "连接"] },
    { label: "噪音", keys: ["noise", "loud", "quiet", "noisy", "噪音", "安静"] },
    { label: "拖地", keys: ["mop", "tile", "water", "拖地", "拖布"] },
    { label: "地毯/边角", keys: ["rug", "carpet", "corner", "地毯", "边角"] },
    { label: "售后/维护", keys: ["support", "bag", "dock", "maintenance", "售后", "耗材"] }
  ];
  const text = reviews.map((review) => `${review.title || ""} ${review.text || ""}`).join(" ").toLowerCase();
  return dictionary
    .map((theme) => ({
      label: theme.label,
      count: theme.keys.reduce((sum, key) => sum + (text.includes(key.toLowerCase()) ? 1 : 0), 0)
    }))
    .filter((theme) => theme.count > 0)
    .sort((a, b) => b.count - a.count);
}

function scoreTheme(themes, label) {
  const found = themes.find((theme) => theme.label.includes(label));
  if (!found) return "样例中低频";
  if (found.count >= 3) return "高频";
  return "中频";
}

function inferProductRisk(product) {
  const features = (product.features || []).join(" ");
  if (/自动集尘|自清洁/.test(features)) return "需重点解释耗材成本、基站噪音和维护周期。";
  if (/App|地图|导航/.test(features)) return "需降低用户对建图复杂度和连接稳定性的担忧。";
  return "需补充真实清洁场景，避免只停留在功能参数。";
}

function average(values) {
  const valid = values.map(Number).filter(Number.isFinite);
  if (!valid.length) return 0;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}
