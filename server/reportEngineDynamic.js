const moduleTitles = {
  overview: "市场与竞品概览",
  purchaseMotivations: "用户购买动机",
  painPoints: "高频差评痛点",
  competitorSellingPoints: "竞品卖点拆解",
  opportunityMatrix: "机会矩阵",
  positioningAdvice: "差异化定位建议",
  gtmActions: "Listing/GTM 行动建议"
};

const playbooks = {
  pet: {
    label: "宠物家庭清洁",
    opportunities: [
      ["宠物毛发低维护", "毛发缠绕、尘袋消耗快、滚刷难清理", "竞品多强调吸力，少证明防缠绕和维护周期。", "高", "主打零缠绕滚刷、大尘袋和 30 天低维护宠物场景。"],
      ["猫砂与餐厨碎屑清洁", "猫砂、干粮、碎屑容易被边刷打散", "多数 Listing 没有把宠物家庭的混合垃圾讲具体。", "高", "用猫砂、宠物粮、长发三类素材做对比视频和首屏图。"],
      ["宠物事故避障信任", "用户担心宠物事故、线缆和玩具被卷入", "避障卖点常停留在 AI 参数。", "中", "强调宠物事故识别、禁区设置和离家清扫安全感。"],
      ["耗材透明包", "滤网、滚刷、尘袋长期成本不清楚", "竞品弱化后续使用成本。", "中", "捆绑首年耗材包，降低首次购买顾虑。"]
    ],
    positioning: ["定位为“更适合宠物家庭的低维护扫地机器人”，把少缠绕、少倒尘、少清理放在吸力参数之前。", "Listing 首屏优先展示猫砂、长发、宠物粮和尘袋容量，而不是只写 Pa 数值。", "评价运营重点追踪 hair、pet、brush、bag、maintenance 等关键词。"],
    actions: ["制作宠物家庭场景素材包：猫砂区、沙发下毛发、宠物饭碗周围。", "把防缠绕滚刷和耗材包做成首屏差异化模块。", "上线前找宠物家庭种子用户验证滚刷清理频率和尘袋更换周期。"]
  },
  small: {
    label: "小户型低噪音",
    opportunities: [
      ["小户型静音清洁", "噪音、自清洁打扰、夜间不可用", "高端机型强调功能多，较少强调少打扰。", "高", "主打静音档、定时集尘和夜间不打扰。"],
      ["老人友好设置", "App 复杂、房间命名难、设置步骤多", "竞品把复杂功能当优势，忽略低学习成本。", "高", "强调一键建图、默认清扫和离线实体键可用。"],
      ["紧凑基站", "基站占地过大，小公寓难摆放", "高端基站越来越大，空间焦虑明显。", "中", "突出窄基站、靠墙收纳和小户型摆放图。"],
      ["低矮家具清扫", "床底、沙发下灰尘难处理", "竞品少量化机身高度和通过性。", "中", "用家具底部通行高度做图示化卖点。"]
    ],
    positioning: ["定位为“小户型和老人友好的安静扫地机器人”，核心是少打扰、易设置、占地小。", "弱化复杂参数，把首屏信息改成静音、紧凑、简单、能钻家具底。", "广告素材优先展示公寓、婴儿睡眠、居家办公和父母使用场景。"],
    actions: ["新增小户型尺寸对比图，展示基站占地和机身高度。", "在 Listing FAQ 解释静音档、夜间集尘关闭和一键清扫。", "用短视频演示 3 分钟完成建图和首次清扫。"]
  },
  value: {
    label: "入门性价比",
    opportunities: [
      ["首次购买低门槛", "用户想尝试机器人清洁但担心买贵踩坑", "高端竞品教育成本高，入门人群更关注确定性。", "高", "主打第一台扫地机器人、简单可靠和核心清洁够用。"],
      ["基础清洁可信度", "低价产品容易被怀疑清洁弱、寿命短", "便宜竞品常只打价格，不解释能力边界。", "高", "明确适合硬地板、低毛地毯、日常碎屑，不夸大深度拖地。"],
      ["低维护成本", "配件难找、耗材贵会放大低价用户顾虑", "入门款常忽略售后和配件可得性。", "中", "提供低价耗材包和清晰维护周期表。"],
      ["简单控制", "App 和地图功能不是所有入门用户刚需", "部分竞品用复杂功能增加学习成本。", "中", "强调遥控器、实体键、定时清扫等简单路径。"]
    ],
    positioning: ["定位为“第一台扫地机器人的性价比选择”，不要伪装成高端全能机。", "把适用边界讲清楚：硬地板、低毛地毯、日常碎屑、宠物浮毛。", "用低价耗材和简单控制建立信任，减少首次购买风险。"],
    actions: ["Listing 首屏加入“适合第一次购买”“核心清洁够用”“低耗材成本”。", "把对比对象从同价位入门机切入，避免被高端能力对比拉低感知。", "增加 30 天新手清洁计划和低价配件包。"]
  },
  premium: {
    label: "中高端扫拖一体",
    opportunities: [
      ["全自动维护可信度", "用户担心基站噪音、异味、故障和维护复杂", "竞品强调全自动，但少解释失败场景和维护成本。", "高", "主打基站自清洁、异味控制、维护提醒和故障恢复。"],
      ["拖地效果证明", "用户认为拖地功能鸡肋、留水痕或拖布脏", "扫拖一体卖点容易被怀疑是参数堆叠。", "高", "用厨房污渍、宠物脚印和水痕控制做素材。"],
      ["地图稳定与多楼层", "固件更新、地图丢失、多房间命名复杂", "高端机型功能越多，稳定预期越高。", "中", "强调地图备份、断点恢复和多楼层管理。"],
      ["高价购买理由", "用户质疑溢价是否值回票价", "旗舰竞品价格高但价值解释不足。", "中", "把节省维护时间量化成每周少做几件事。"]
    ],
    positioning: ["定位为“少动手的高端扫拖维护系统”，重点证明基站可靠、拖地有效、地图稳定。", "不要只讲旗舰参数，要把用户少倒尘、少洗拖布、少重建地图的收益量化。", "适合瞄准高收入家庭、宠物家庭和大户型用户。"],
    actions: ["增加自动洗拖布、烘干、集尘噪音和异味控制的对比素材。", "在 FAQ 中解释基站维护频率、耗材成本和地图恢复方式。", "用高端竞品对比表突出维护自动化和真实拖地效果。"]
  }
};

const general = {
  label: "综合品类",
  opportunities: [
    ["低维护日常清洁", "毛发缠绕、尘袋消耗、滚刷清理麻烦", "竞品常强调吸力，低维护证据不足。", "高", "围绕少缠绕、少倒尘和耗材透明建立差异化。"],
    ["稳定地图与简单 App", "地图丢失、连接失败、设置复杂", "智能功能多但稳定性表达弱。", "高", "强调地图备份、离线清扫和新手引导。"],
    ["真实拖地效果", "留水痕、拖布脏、厚地毯不适配", "扫拖一体卖点常缺少场景证明。", "中", "用厨房、宠物脚印、硬地板场景做实测素材。"],
    ["售后和耗材信任", "维修慢、配件难找、耗材贵", "长期使用成本不透明。", "中", "提供耗材包、延保和维护成本表。"]
  ],
  positioning: ["定位为“低维护、稳定、好上手的日常清洁助手”，避免只做参数堆叠。", "用场景证据证明价值：宠物毛发、小户型、厨房碎屑、地毯边缘。", "把售后、耗材和 App 稳定性作为转化信任点。"],
  actions: ["把 Listing 信息层级改成场景收益、维护成本、核心参数。", "广告素材按宠物家庭、小户型、忙碌家庭三类拆分。", "评价运营追踪 hair、map、app、noise、support、bag 等关键词。"]
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
  const scenario = inferScenario(group, products, reviews, averagePrice);

  return {
    language: "zh-CN",
    generatedAt: new Date().toISOString(),
    modules: moduleTitles,
    overview: `${group}覆盖 ${products.length || 1} 个代表商品，主要品牌包括${brands.join("、") || "iRobot、Roborock、Ecovacs、Shark、Eufy"}。样例均价约 $${Math.round(averagePrice || 559)}，平均评分约 ${(averageRating || 4.3).toFixed(1)}。本次报告识别出的核心场景是“${scenario.label}”，因此机会判断会优先围绕该场景的购买动机、差评风险和差异化卖点展开。`,
    purchaseMotivations: buildPurchaseMotivations(scenario, positiveThemes),
    painPoints: buildPainPoints(negativeThemes),
    competitorSellingPoints: products.map((product) => ({
      brand: product.brand || "竞品",
      product: product.name || "扫地机器人",
      sellingPoints: product.features || ["自动清洁", "智能导航"],
      risk: inferProductRisk(product)
    })),
    opportunityMatrix: scenario.opportunities.map(([opportunity, painPoint, competitorGap, priority, action]) => ({
      opportunity,
      painPoint,
      competitorGap,
      priority,
      action
    })),
    positioningAdvice: buildPositioningAdvice(scenario, products, reviews, negativeThemes, positiveThemes),
    gtmActions: buildGtmActions(scenario, products, reviews, negativeThemes, positiveThemes)
  };
}

export function validateAnalyzeRequest(request) {
  const reviews = Array.isArray(request?.reviews) ? request.reviews : [];
  if (reviews.length < 1) return "至少需要 1 条评论才能生成竞品机会报告。";
  return "";
}

function inferScenario(group, products, reviews, averagePrice) {
  if (/入门|性价比|低价/.test(group)) return playbooks.value;
  if (/宠物|毛发|防缠绕/.test(group)) return playbooks.pet;
  if (/小户型|低噪音|超薄|低矮/.test(group)) return playbooks.small;
  if (/高端|扫拖一体|自动洗拖布|自动维护|基站/.test(group)) return playbooks.premium;

  const text = [
    group,
    ...products.flatMap((product) => [product.name, product.category, product.segment, ...(product.features || [])]),
    ...reviews.slice(0, 120).flatMap((review) => [review.title, review.text])
  ].filter(Boolean).join(" ").toLowerCase();

  if (/宠物|毛发|防缠绕|pet|hair|cat|dog/.test(text)) return playbooks.pet;
  if (/小户型|低噪音|超薄|低矮|quiet|small apartment|low profile/.test(text)) return playbooks.small;
  if (/高端|扫拖一体|自动洗拖布|自动维护|基站|omni|ultra|mop/.test(text) || averagePrice > 650) return playbooks.premium;
  if (/入门|性价比|低价|budget|first robot|good value/.test(text) || averagePrice < 320) return playbooks.value;
  return general;
}

function buildPurchaseMotivations(scenario, positiveThemes) {
  const base = {
    "宠物家庭清洁": ["希望减少宠物毛发、猫砂和宠物粮碎屑带来的高频清洁压力。", "愿意为防缠绕、自动集尘和低维护体验付费。"],
    "小户型低噪音": ["希望在小户型里用更少空间和更低噪音完成日常清洁。", "更看重简单设置、静音运行和不打扰家人。"],
    "入门性价比": ["首次购买用户希望低成本验证机器人清洁是否真的省事。", "更看重价格、基础清洁能力和耗材成本透明。"],
    "中高端扫拖一体": ["高端用户希望把倒尘、洗拖布、补水等维护动作尽量自动化。", "愿意为真实拖地效果、稳定地图和可靠基站支付溢价。"],
    "综合品类": ["希望减少日常清扫时间，尤其是灰尘、碎屑、宠物毛发等高频场景。", "愿意为自动集尘、扫拖一体和智能导航付费，但前提是维护成本可控。"]
  };
  return [
    ...(base[scenario.label] || base["综合品类"]),
    ...positiveThemes.slice(0, 2).map((theme) => `正向评论反复提到“${theme.label}”，可作为转化卖点。`)
  ];
}

function buildPainPoints(negativeThemes) {
  return [
    { theme: "毛发缠绕与维护成本", frequency: scoreTheme(negativeThemes, "宠物毛发"), severity: "高", evidence: "评论中常见滚刷缠绕、尘袋消耗快、耗材成本不透明。", implication: "要把维护周期和耗材成本讲清楚，而不只是强调吸力。" },
    { theme: "地图/App 稳定性", frequency: scoreTheme(negativeThemes, "地图/App"), severity: "高", evidence: "用户对地图丢失、连接失败、房间命名复杂非常敏感。", implication: "稳定地图、简单设置和离线可用可以成为信任卖点。" },
    { theme: "噪音与空间占用", frequency: scoreTheme(negativeThemes, "噪音"), severity: "中", evidence: "自动集尘、自清洁基站和大体积基站容易造成打扰。", implication: "静音策略和基站尺寸需要被场景化说明。" },
    { theme: "拖地效果与边角清洁", frequency: scoreTheme(negativeThemes, "拖地"), severity: "中", evidence: "用户常质疑拖地是否有效、是否留水痕、是否遗漏边角。", implication: "拖地和边角能力必须用真实场景证明。" }
  ];
}

function buildPositioningAdvice(scenario, products, reviews, negativeThemes, positiveThemes) {
  const profile = buildMarketProfile(products, reviews);
  const advice = [];

  if (profile.topBrands.length) {
    advice.push(`定位不要只写“${scenario.label}”，要明确对标 ${profile.topBrands.join("、")} 等竞品，并把 ${profile.primaryProof} 作为首屏差异化证据。`);
  }

  if (profile.featureAngles.length) {
    advice.push(`围绕“${profile.featureAngles.slice(0, 3).join(" + ")}”建立卖点组合，避免所有 ASIN 都复用同一套泛化场景话术。`);
  }

  if (profile.productSpecificAngles.length) {
    advice.push(`该 ASIN 的独特点是“${profile.productSpecificAngles.slice(0, 3).join("、")}”，定位应围绕这些证据展开，而不是只落到通用宠物毛发场景。`);
  }

  if (profile.pricePosition) {
    advice.push(`${profile.pricePosition}，Listing 信息层级应先解释用户为什么为这些能力付费，再展示参数。`);
  }

  if (negativeThemes.length) {
    advice.push(`针对当前证据中出现的“${negativeThemes.map((theme) => theme.label).slice(0, 2).join("、")}”风险，把稳定性、维护成本和适用边界写成可验证承诺。`);
  } else if (profile.usesListingEvidence) {
    advice.push("当前 Amazon reviews 未返回真实评论，应明确标注为基于 listing evidence 的定位判断，后续补充真实评论后再校准差评痛点。");
  }

  return uniqueNonEmpty(advice).slice(0, 4).concat(scenario.positioning).slice(0, 4);
}

function buildGtmActions(scenario, products, reviews, negativeThemes, positiveThemes) {
  const profile = buildMarketProfile(products, reviews);
  const actions = [];

  if (profile.heroProducts.length) {
    actions.push(`为 ${profile.heroProducts.join("、")} 制作对比表：价格、核心功能、适用家庭、维护动作和不适用场景，替代笼统竞品描述。`);
  }

  if (profile.featureAngles.includes("LiDAR/地图导航")) {
    actions.push("新增地图稳定性素材：建图速度、禁区设置、多房间路线和断点续扫，用动图或短视频证明导航不是参数堆砌。");
  }

  if (profile.featureAngles.includes("强吸力/毛发清洁")) {
    actions.push("拍摄毛发、猫砂、碎屑三类清洁测试，并在标题或 A+ 模块里量化滚刷清理频率。");
  }

  if (profile.featureAngles.includes("扫拖一体")) {
    actions.push("把拖地效果拆成厨房污渍、脚印、水痕控制三个场景，避免只写 vacuum and mop combo。");
  }

  if (profile.featureAngles.includes("低噪音/小户型")) {
    actions.push("补充小户型摆放图、夜间运行噪音说明和老人/租房用户的一键清扫路径。");
  }

  if (profile.productSpecificAngles.includes("Sonic mopping")) {
    actions.push("为 sonic mopping 单独做硬地板污渍测试，和普通湿拖/只吸尘机型区分开。");
  }

  if (profile.productSpecificAngles.includes("HEPA/过敏原过滤")) {
    actions.push("在 A+ 或 FAQ 中解释 HEPA、基站密封和宠物毛发场景的关系，面向过敏/宠物家庭强化信任。");
  }

  if (profile.productSpecificAngles.includes("超薄机身")) {
    actions.push("补充沙发底、床底、柜底通过性素材，把超薄机身从参数变成小户型可感知利益。");
  }

  if (profile.productSpecificAngles.includes("边角扩展刷")) {
    actions.push("拍摄墙边、桌腿、宠物碗周边的边角清洁对比，突出扩展边刷不是普通侧刷。");
  }

  if (profile.productSpecificAngles.includes("10000Pa 吸力")) {
    actions.push("把 10000Pa 吸力拆成地毯深处灰尘、猫砂、颗粒物三组测试，避免只堆最大 Pa 数字。");
  }

  if (profile.productSpecificAngles.includes("仅吸尘不拖地")) {
    actions.push("Listing 明确写清 vacuum only/no mopping，避免扫拖一体预期错误，并把预算集中在吸力和防缠绕证明上。");
  }

  if (negativeThemes.length) {
    actions.push(`在 FAQ 中优先回应 ${negativeThemes.map((theme) => theme.label).slice(0, 2).join("、")}，用保养周期、耗材成本或售后流程降低转化阻力。`);
  }

  if (positiveThemes.length) {
    actions.push(`把“${positiveThemes.map((theme) => theme.label).slice(0, 2).join("、")}”相关评价关键词放入广告词包和 review follow-up 标签。`);
  }

  if (profile.usesListingEvidence) {
    actions.push("继续用 amazon-buddy ASIN 详情补齐竞品池，同时单独导入 CSV/粘贴真实评论，避免 GTM 决策只依赖 listing 文案。");
  }

  return uniqueNonEmpty(actions).slice(0, 5).concat(scenario.actions).slice(0, 5);
}

function buildMarketProfile(products, reviews) {
  const text = [
    ...products.flatMap((product) => [product.brand, product.name, product.category, product.segment, ...(product.features || [])]),
    ...reviews.flatMap((review) => [review.title, review.text])
  ].filter(Boolean).join(" ").toLowerCase();
  const prices = products.map((product) => Number(product.price)).filter((price) => Number.isFinite(price) && price > 0);
  const averagePrice = average(prices);

  return {
    topBrands: [...new Set(products.map((product) => product.brand).filter(Boolean))].slice(0, 3),
    heroProducts: products.map((product) => product.name || product.id).filter(Boolean).slice(0, 2),
    featureAngles: detectFeatureAngles(text),
    productSpecificAngles: detectProductSpecificAngles(text),
    primaryProof: choosePrimaryProof(text),
    pricePosition: describePricePosition(averagePrice),
    usesListingEvidence: reviews.some((review) => /listing evidence/i.test(review.title || ""))
  };
}

function detectFeatureAngles(text) {
  const hasMopNegation = /no mopping|without mopping|vacuum only|no mop|不拖地|仅吸尘/.test(text);
  const angles = [
    [/lidar|laser|navigation|map|mapping|3d|地图|导航|建图/, "LiDAR/地图导航"],
    [/pa|suction|duoroller|brush|pet hair|hair|毛发|吸力|滚刷/, "强吸力/毛发清洁"],
    [/mop|mopping|water tank|snapmop|扫拖|拖地|水箱/, "扫拖一体"],
    [/self-empty|auto empty|dock|bag|station|集尘|基站/, "自动集尘/基站维护"],
    [/quiet|noise|low profile|small apartment|低噪|小户型|超薄/, "低噪音/小户型"],
    [/runtime|battery|240min|whole-home|续航|全屋/, "长续航/大户型"]
  ];
  return angles
    .filter(([pattern, label]) => pattern.test(text) && !(label === "扫拖一体" && hasMopNegation))
    .map(([, label]) => label);
}

function detectProductSpecificAngles(text) {
  const angles = [
    [/sonic mopping|sonic mop/, "Sonic mopping"],
    [/hepa|allergen/, "HEPA/过敏原过滤"],
    [/45-day|45 day|45 days|45天/, "45 天基站容量"],
    [/60 days|60-day|8 weeks|8周|60天/, "60 天/8 周自清空"],
    [/2\.85-inch|2\.85 inch|slim|low profile|超薄/, "超薄机身"],
    [/edge expansion|corner rover|extendable.*brush|边角|扩展边刷/, "边角扩展刷"],
    [/10000pa|10,000pa|10k pa/, "10000Pa 吸力"],
    [/4000pa|4,000 pa|4000 pa/, "4000Pa 吸力"],
    [/no mopping|vacuum only|no mop|仅吸尘|不拖地/, "仅吸尘不拖地"],
    [/remote control|voice control|遥控|语音/, "遥控/语音控制"]
  ];
  return angles.filter(([pattern]) => pattern.test(text)).map(([, label]) => label);
}

function choosePrimaryProof(text) {
  if (/lidar|map|mapping|navigation|地图|导航/.test(text)) return "导航和地图能力";
  if (/pet hair|hair|duoroller|brush|毛发|滚刷/.test(text)) return "毛发清洁和滚刷维护";
  if (/mop|water tank|扫拖|拖地/.test(text)) return "扫拖一体效果";
  if (/dock|self-empty|station|基站|集尘/.test(text)) return "基站维护效率";
  return "商品详情和用户证据";
}

function describePricePosition(averagePrice) {
  if (!averagePrice) return "";
  if (averagePrice >= 700) return `均价约 $${Math.round(averagePrice)}，属于高端段`;
  if (averagePrice >= 320) return `均价约 $${Math.round(averagePrice)}，属于中端性能段`;
  return `均价约 $${Math.round(averagePrice)}，属于入门/性价比段`;
}

function uniqueNonEmpty(items) {
  return [...new Set(items.map((item) => String(item || "").trim()).filter(Boolean))];
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
    .map((theme) => ({ label: theme.label, count: theme.keys.reduce((sum, key) => sum + (text.includes(key.toLowerCase()) ? 1 : 0), 0) }))
    .filter((theme) => theme.count > 0)
    .sort((a, b) => b.count - a.count);
}

function scoreTheme(themes, label) {
  const found = themes.find((theme) => theme.label.includes(label));
  if (!found) return "样例中低频";
  return found.count >= 3 ? "高频" : "中频";
}

function inferProductRisk(product) {
  const features = (product.features || []).join(" ");
  if (/自动集尘|自动维护|自动洗拖布|基站/.test(features)) return "需重点解释耗材成本、基站噪音、异味和维护周期。";
  if (/App|地图|导航|避障/.test(features)) return "需降低用户对建图复杂度和连接稳定性的担忧。";
  if (/入门|性价比|低价/.test(features)) return "需明确适用边界，避免被高端机型能力对比拉低感知。";
  return "需补充真实清洁场景，避免只停留在功能参数。";
}

function average(values) {
  const valid = values.map(Number).filter(Number.isFinite);
  if (!valid.length) return 0;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}
