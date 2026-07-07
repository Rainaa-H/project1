const productBlueprints = [
  ["iRobot", "Roomba j7+ Self-Emptying Robot Vacuum", 649, ["自动集尘", "障碍物识别", "宠物毛发清洁", "App 地图"], "premium"],
  ["iRobot", "Roomba s9+ Corner Cleaning Robot Vacuum", 899, ["强吸力", "边角清洁", "自动集尘", "宠物家庭"], "premium"],
  ["iRobot", "Roomba Combo j9+ Vacuum and Mop", 999, ["扫拖一体", "自动补水", "智能避障", "高端基站"], "premium"],
  ["iRobot", "Roomba i5+ EVO Robot Vacuum", 449, ["自动集尘", "智能地图", "语音控制", "日常清洁"], "mid"],
  ["iRobot", "Roomba 694 Robot Vacuum", 249, ["入门款", "三段清洁", "语音控制", "小户型"], "budget"],
  ["Roborock", "Roborock S8 Robot Vacuum and Mop", 599, ["强吸力", "激光导航", "扫拖一体", "声波震动拖地"], "premium"],
  ["Roborock", "Roborock S8 Pro Ultra Robot Vacuum", 1199, ["自动洗拖布", "自动集尘", "自动烘干", "高端基站"], "premium"],
  ["Roborock", "Roborock Q Revo Vacuum and Mop", 799, ["旋转拖布", "自动清洗", "激光导航", "扫拖一体"], "premium"],
  ["Roborock", "Roborock Q5+ Robot Vacuum", 429, ["自动集尘", "长续航", "激光导航", "大户型"], "mid"],
  ["Roborock", "Roborock E4 Robot Vacuum", 279, ["入门款", "吸拖基础", "长续航", "性价比"], "budget"],
  ["Ecovacs", "DEEBOT T20 Omni Robot Vacuum and Mop", 799, ["自动洗拖布", "自动集尘", "热水清洁", "语音控制"], "premium"],
  ["Ecovacs", "DEEBOT X2 Omni Robot Vacuum", 1099, ["方形机身", "AI 避障", "自动维护", "高端基站"], "premium"],
  ["Ecovacs", "DEEBOT N10 Plus Robot Vacuum", 399, ["自动集尘", "强吸力", "长续航", "宠物毛发"], "mid"],
  ["Ecovacs", "DEEBOT T10 Plus Robot Vacuum", 599, ["AI 避障", "自动集尘", "扫拖一体", "语音助手"], "mid"],
  ["Ecovacs", "DEEBOT 500 Robot Vacuum", 199, ["入门款", "低噪音", "App 控制", "小户型"], "budget"],
  ["Shark", "Shark AI Ultra Robot Vacuum", 399, ["矩阵清洁", "自动集尘", "宠物毛发", "语音控制"], "mid"],
  ["Shark", "Shark Matrix Plus 2-in-1 Robot", 499, ["扫拖一体", "矩阵清洁", "自动集尘", "地毯识别"], "mid"],
  ["Shark", "Shark IQ Robot Self-Empty XL", 329, ["自动集尘", "自清洁滚刷", "宠物家庭", "大尘盒"], "mid"],
  ["Shark", "Shark Detect Pro Robot Vacuum", 599, ["污垢识别", "边缘清洁", "自动集尘", "轻量基站"], "premium"],
  ["Shark", "Shark ION Robot Vacuum", 179, ["入门款", "低矮机身", "App 控制", "日常清扫"], "budget"],
  ["Eufy", "Eufy L60 Robot Vacuum with Self Empty Station", 349, ["低噪音", "激光导航", "自动集尘", "小户型友好"], "mid"],
  ["Eufy", "Eufy X10 Pro Omni Robot Vacuum", 799, ["扫拖一体", "自动洗拖布", "AI 避障", "宠物毛发"], "premium"],
  ["Eufy", "Eufy RoboVac 11S Slim", 229, ["超薄机身", "低噪音", "入门款", "小户型"], "budget"],
  ["Eufy", "Eufy G30 Edge Robot Vacuum", 279, ["路径规划", "边界条", "低噪音", "App 控制"], "budget"],
  ["Eufy", "Eufy RoboVac X8 Hybrid", 399, ["双涡轮吸力", "扫拖一体", "激光导航", "宠物家庭"], "mid"],
  ["Dreame", "Dreame L20 Ultra Robot Vacuum", 1199, ["自动维护", "伸缩拖布", "强吸力", "高端基站"], "premium"],
  ["Dreame", "Dreame D10 Plus Robot Vacuum", 399, ["自动集尘", "激光导航", "长续航", "扫拖一体"], "mid"],
  ["Dreame", "Dreame L10s Ultra Robot Vacuum", 899, ["自动洗拖布", "AI 避障", "自动集尘", "语音控制"], "premium"],
  ["Dreame", "Dreame D9 Max Robot Vacuum", 299, ["强吸力", "激光导航", "扫拖一体", "性价比"], "budget"],
  ["Dreame", "DreameBot W10 Robot Vacuum", 699, ["旋转拖布", "自动清洗", "地面深洁", "大基站"], "premium"],
  ["Narwal", "Narwal Freo Robot Vacuum and Mop", 899, ["自动洗拖布", "智能脏污识别", "低噪音", "扫拖一体"], "premium"],
  ["Narwal", "Narwal T10 Robot Mop and Vacuum", 799, ["自动清洗", "拖地强化", "低噪音", "大水箱"], "premium"],
  ["Narwal", "Narwal Freo X Plus Robot Vacuum", 499, ["防缠绕", "大尘袋", "激光导航", "宠物毛发"], "mid"],
  ["Narwal", "Narwal Freo X Ultra Robot Vacuum", 1099, ["零缠绕滚刷", "自动维护", "高端基站", "拖地强化"], "premium"],
  ["Narwal", "Narwal S10 Pro Wet Dry Robot", 599, ["湿拖强化", "边缘清洁", "低维护", "小户型"], "mid"],
  ["Yeedi", "Yeedi Vac Station Robot Vacuum", 299, ["自动集尘", "视觉导航", "宠物毛发", "性价比"], "budget"],
  ["Yeedi", "Yeedi Cube Robot Vacuum and Mop", 699, ["自清洁基站", "扫拖一体", "紧凑基站", "低维护"], "premium"],
  ["Yeedi", "Yeedi Vac 2 Pro Robot Vacuum", 349, ["避障", "振动拖地", "视觉导航", "小户型"], "mid"],
  ["Yeedi", "Yeedi K650 Robot Vacuum", 169, ["入门款", "低噪音", "宠物毛发", "遥控器"], "budget"],
  ["Yeedi", "Yeedi Mop Station Pro", 599, ["自动洗拖布", "拖地强化", "App 控制", "硬地板"], "mid"],
  ["ILIFE", "ILIFE V3s Pro Robot Vacuum", 159, ["宠物毛发", "入门款", "低矮机身", "硬地板"], "budget"],
  ["ILIFE", "ILIFE A10 Robot Vacuum", 269, ["激光导航", "分区清洁", "App 控制", "性价比"], "budget"],
  ["ILIFE", "ILIFE V8s Robot Vacuum and Mop", 219, ["扫拖一体", "大尘盒", "硬地板", "定时清洁"], "budget"],
  ["ILIFE", "ILIFE T10s Robot Vacuum", 399, ["自动集尘", "激光导航", "扫拖一体", "大户型"], "mid"],
  ["ILIFE", "ILIFE A11 Robot Vacuum", 329, ["激光导航", "扫拖一体", "禁区设置", "小户型"], "mid"],
  ["Bissell", "Bissell SpinWave Wet and Dry Robot", 299, ["旋转拖布", "硬地板", "宠物家庭", "低价扫拖"], "budget"],
  ["Bissell", "Bissell EV675 Robot Vacuum", 199, ["入门款", "低矮机身", "定时清洁", "硬地板"], "budget"],
  ["Bissell", "Bissell ReadyClean A3 Robotic Mop", 349, ["拖地强化", "湿拖", "小户型", "低维护"], "mid"],
  ["Bissell", "Bissell ICONpet Robot Vacuum", 399, ["宠物毛发", "防缠绕", "强吸力", "大尘盒"], "mid"],
  ["Bissell", "Bissell SmartClean Robot Vacuum", 249, ["入门款", "App 控制", "日常清洁", "低噪音"], "budget"]
];

const reviewThemes = [
  ["Great with pet hair but needs brush cleaning", "It picks up dog hair well, but long hair still wraps around the brush after a few runs.", 4],
  ["Self-empty bags fill quickly", "The self-empty dock is convenient, though bags fill faster than expected in a two-pet home.", 3],
  ["Map disappeared after update", "After a firmware update the map disappeared and I had to remap the whole apartment.", 2],
  ["App has too many settings", "Cleaning is strong, but the app has too many settings for older family members.", 3],
  ["Quiet enough for daytime cleaning", "It is quiet enough for work-from-home calls, especially in standard vacuum mode.", 5],
  ["Self-empty cycle is loud", "The vacuum cleans fine, but the self-empty cycle is loud enough to wake the baby.", 3],
  ["Mop helps with daily dust", "The mop keeps tile floors fresh, but it does not replace a deep manual mop.", 4],
  ["Struggles on thick rugs", "It works well on hard floors and low rugs, but thick carpets slow it down.", 3],
  ["Misses some corners", "The robot covers most rooms, but it still misses crumbs under cabinet edges and tight corners.", 3],
  ["Support took too long", "The dock error took several days to resolve because customer support replied with generic steps.", 2],
  ["Easy setup for small apartment", "Setup was simple and the first map was accurate in my small apartment.", 5],
  ["Good value for the price", "It does not feel as premium as expensive models, but the cleaning performance is good for the price.", 4],
  ["Dock is too large", "The base station is useful, but it takes up more floor space than the pictures suggest.", 3],
  ["Obstacle avoidance is inconsistent", "It avoids shoes and cables most days, but still gets confused near chair legs.", 3],
  ["Consumables are expensive", "Replacement bags, filters, and brushes add up if you run it every day.", 3],
  ["Handles cat litter well", "It picks up cat litter around the box much better than my old robot vacuum.", 5],
  ["Boundary zones work well", "No-go zones are accurate and keep the robot away from the pet bowls.", 4],
  ["Battery is enough for one floor", "The battery covers my first floor in one pass, but larger homes may need recharge and resume.", 4],
  ["Water tank needs frequent refill", "The mop feature is useful, yet the water tank needs refilling more often than I expected.", 3],
  ["Good under furniture", "The low profile helps it clean under the sofa and bed where dust collects.", 4],
  ["Gets stuck on black rugs", "It sometimes treats black rugs like a cliff and refuses to clean them.", 2],
  ["Dust bin sensor is helpful", "The app reminders for bin and filter maintenance are helpful for busy weeks.", 4],
  ["Navigation looks efficient", "The laser navigation makes neat rows and does not wander randomly.", 5],
  ["Voice control is hit or miss", "Alexa starts the robot, but room-specific commands fail from time to time.", 3],
  ["Brush is easy to remove", "The main brush pops out quickly, so maintenance is less annoying than my old model.", 4],
  ["Shipping packaging was weak", "The robot works, but the box arrived damaged and the dock had a small scratch.", 3],
  ["Great for daily crumbs", "It is excellent for kitchen crumbs and dust between weekly deep cleans.", 5],
  ["Mopping leaves streaks", "The mop can leave streaks if the pad is too wet or the floor is already dirty.", 3],
  ["Reliable schedule cleaning", "The schedule runs every morning and has been reliable for three months.", 5],
  ["Replacement parts hard to find", "Filters and side brushes are not always easy to find in stock.", 2],
  ["Good for hardwood", "Hardwood floors look cleaner and the wheels have not scratched the finish.", 5],
  ["Needs better edge cleaning", "It leaves a narrow line of dust near baseboards after most runs.", 3],
  ["Pet accident avoidance matters", "Obstacle detection is important because I worry about pet accidents when I am away.", 4],
  ["Not ideal for high thresholds", "It cannot climb the threshold between my kitchen and laundry room.", 2],
  ["Maintenance reminders are clear", "The app clearly tells me when to wash pads and change filters.", 4],
  ["Station cleaning is convenient", "Auto-washing the mop pad saves time after muddy paw prints.", 5],
  ["Room naming is confusing", "Naming rooms in the app took a few tries and the UI could be simpler.", 3],
  ["Good suction on cereal", "It picks up cereal, sand, and dry food without scattering too much.", 4],
  ["Side brush scatters debris", "On hard floors the side brush sometimes throws crumbs away from the vacuum path.", 3],
  ["Excellent for busy parents", "It keeps the floors presentable during the week with minimal attention.", 5],
  ["Dock odor after wet mopping", "The dock can smell if the mop pad is not dried quickly enough.", 2],
  ["Carpet boost works", "Carpet boost increases suction automatically and helps with pet fur.", 4],
  ["Hard to clean around dining chairs", "It spends too much time navigating around dining chair legs.", 3],
  ["Price feels high", "The robot is good, but the premium price is hard to justify without a sale.", 3],
  ["Great first robot vacuum", "For a first robot vacuum it is easy to use and saves real time.", 5],
  ["Firmware improved navigation", "A recent firmware update improved navigation and reduced stuck events.", 4],
  ["Dock alignment issue", "Sometimes it fails to align with the dock and needs to be moved by hand.", 2],
  ["Good low-noise mode", "Quiet mode is useful at night, although cleaning takes longer.", 4],
  ["Works best with prepared rooms", "It performs best when cables and small toys are picked up first.", 3],
  ["Clear value for pet owners", "The biggest benefit is not perfect floors, but keeping pet hair under control every day.", 5]
];

export const sampleProducts = productBlueprints.map(([brand, name, price, features, tier], index) => ({
  id: `${slugify(brand)}-${index + 1}`,
  brand,
  name,
  price,
  rating: Number((4.0 + ((index * 7) % 8) / 10).toFixed(1)),
  reviewCount: 1800 + ((index * 1379) % 18000),
  category: tier === "premium" ? "Premium Robot Vacuum and Mop" : "Robot Vacuum",
  segment: tier,
  features
}));

export const sampleReviews = sampleProducts.flatMap((product, productIndex) =>
  reviewThemes.map(([title, text, baseRating], reviewIndex) => ({
    productId: product.id,
    title,
    text: `${text} This review is for ${product.brand} ${product.name}.`,
    rating: clampRating(baseRating + ((productIndex + reviewIndex) % 3 === 0 ? -1 : 0)),
    verifiedPurchase: (productIndex + reviewIndex) % 5 !== 0,
    helpfulVote: 3 + ((productIndex * 17 + reviewIndex * 11) % 74),
    date: `2025-${String((reviewIndex % 12) + 1).padStart(2, "0")}-${String(((productIndex + reviewIndex) % 27) + 1).padStart(2, "0")}`
  }))
);

export const sampleCompetitorGroups = [
  {
    id: "all-robovacs",
    name: "扫地机器人全量样例",
    description: "覆盖 50 个代表商品与 2,500 条评论，适合做完整品类机会分析。",
    productIds: sampleProducts.map((product) => product.id)
  },
  {
    id: "premium-vacuum-mop",
    name: "中高端扫拖一体机器人",
    description: "聚焦自动集尘、扫拖一体、导航建图和智能避障。",
    productIds: sampleProducts.filter((product) => product.segment === "premium").map((product) => product.id)
  },
  {
    id: "pet-family",
    name: "宠物家庭清洁场景",
    description: "聚焦宠物毛发、防缠绕、自动集尘容量和低维护体验。",
    productIds: sampleProducts
      .filter((product) => product.features.some((feature) => /宠物|防缠绕|自清洁滚刷|零缠绕/.test(feature)))
      .map((product) => product.id)
  },
  {
    id: "small-apartment",
    name: "小户型低噪音场景",
    description: "聚焦低噪音、易设置、轻维护和老人友好操作。",
    productIds: sampleProducts
      .filter((product) => product.features.some((feature) => /低噪音|小户型|超薄|低矮/.test(feature)))
      .map((product) => product.id)
  },
  {
    id: "value-segment",
    name: "入门性价比机型",
    description: "聚焦低价入门、基础清洁和首次购买用户。",
    productIds: sampleProducts.filter((product) => product.segment === "budget").map((product) => product.id)
  }
];

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function clampRating(value) {
  return Math.max(1, Math.min(5, value));
}
