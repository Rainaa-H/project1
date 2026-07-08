import test from "node:test";
import assert from "node:assert/strict";
import { generateFallbackReport } from "../server/reportEngineDynamic.js";
import { sampleCompetitorGroups, sampleProducts, sampleReviews } from "../src/shared/sampleData.js";

test("generateFallbackReport returns every required Chinese opportunity report module", () => {
  const report = generateFallbackReport({
    competitorGroup: "中高端扫拖一体机器人",
    products: [
      {
        id: "roborock-s8",
        brand: "Roborock",
        name: "Roborock S8 Robot Vacuum and Mop",
        price: 599,
        rating: 4.4,
        reviewCount: 8240,
        features: ["激光导航", "强吸力", "扫拖一体"]
      }
    ],
    reviews: [
      {
        title: "Hair gets tangled",
        text: "Works well but pet hair gets tangled in the brush.",
        rating: 3,
        verifiedPurchase: true,
        helpfulVote: 9
      }
    ],
    language: "zh-CN"
  });

  assert.equal(report.language, "zh-CN");
  assert.ok(report.overview.includes("中高端扫拖一体机器人"));
  assert.ok(report.purchaseMotivations.length > 0);
  assert.ok(report.painPoints.length > 0);
  assert.ok(report.competitorSellingPoints.length > 0);
  assert.ok(report.opportunityMatrix.length > 0);
  assert.ok(report.positioningAdvice.length > 0);
  assert.ok(report.gtmActions.length > 0);
});

test("generateFallbackReport adapts opportunity advice to the selected competitor group", () => {
  const petReport = reportForGroup("pet-family");
  const valueReport = reportForGroup("value-segment");

  assert.notDeepEqual(
    petReport.opportunityMatrix.map((item) => item.opportunity),
    valueReport.opportunityMatrix.map((item) => item.opportunity)
  );
  assert.match(petReport.positioningAdvice.join(" "), /宠物|毛发|防缠绕/);
  assert.match(valueReport.positioningAdvice.join(" "), /入门|性价比|低价|首次/);
});

test("generateFallbackReport differentiates positioning and GTM advice from product evidence", () => {
  const lidarReport = generateFallbackReport({
    competitorGroup: "Amazon: robot vacuum",
    products: [
      {
        id: "B0LIDAR",
        brand: "Roborock",
        name: "Roborock Q5 Pro Robot Vacuum and Mop",
        price: 429,
        rating: 4.4,
        reviewCount: 0,
        features: ["LiDAR Navigation", "3D Mapping", "DuoRoller Brush", "5500Pa suction", "Pet Hair"]
      }
    ],
    reviews: [{ productId: "B0LIDAR", title: "Amazon listing evidence", text: "LiDAR 3D Mapping DuoRoller pet hair suction", rating: 0 }],
    language: "zh-CN"
  });

  const quietReport = generateFallbackReport({
    competitorGroup: "Amazon: robot vacuum",
    products: [
      {
        id: "B0QUIET",
        brand: "Eufy",
        name: "Eufy RoboVac Slim Quiet Robot Vacuum",
        price: 199,
        rating: 4.1,
        reviewCount: 0,
        features: ["Quiet cleaning", "Low profile", "Small apartment", "Simple remote control"]
      }
    ],
    reviews: [{ productId: "B0QUIET", title: "Amazon listing evidence", text: "quiet low profile small apartment simple remote", rating: 0 }],
    language: "zh-CN"
  });

  assert.notDeepEqual(lidarReport.positioningAdvice, quietReport.positioningAdvice);
  assert.notDeepEqual(lidarReport.gtmActions, quietReport.gtmActions);
  assert.match(lidarReport.positioningAdvice.join(" "), /LiDAR|地图|导航|毛发|吸力/);
  assert.match(lidarReport.gtmActions.join(" "), /地图|导航|毛发|滚刷/);
  assert.match(quietReport.positioningAdvice.join(" "), /低噪音|小户型|入门|性价比/);
  assert.match(quietReport.gtmActions.join(" "), /小户型|夜间|噪音|一键清扫/);
});

test("generateFallbackReport separates similar LiDAR pet-hair ASINs by specific listing claims", () => {
  const shark = generateFallbackReport({
    competitorGroup: "Amazon: B0DFZ2HMY8",
    products: [{
      id: "B0DFZ2HMY8",
      brand: "Shark",
      name: "Shark Matrix Plus 2-in-1 Robot Vacuum & Mop Sonic Mopping HEPA Self-Empty Base 45-Day Capacity LiDAR Pet Hair",
      price: 0,
      rating: 0,
      reviewCount: 0,
      features: ["Sonic mopping", "Self-emptying", "45-day capacity", "HEPA", "LiDAR"]
    }],
    reviews: [{ productId: "B0DFZ2HMY8", title: "Amazon listing evidence", text: "sonic mopping HEPA 45-day self-empty LiDAR pet hair", rating: 0 }],
    language: "zh-CN"
  });

  const eufy = generateFallbackReport({
    competitorGroup: "Amazon: B0GD1XTMFN",
    products: [{
      id: "B0GD1XTMFN",
      brand: "eufy",
      name: "eufy C10 Self Emptying 8 Weeks Hands Free 2.85-Inch Slim Edge Expansion Brush LiDAR Pet Hair",
      price: 0,
      rating: 0,
      reviewCount: 0,
      features: ["8 weeks hands free", "2.85-inch slim design", "edge expansion brush", "LiDAR", "pet hair"]
    }],
    reviews: [{ productId: "B0GD1XTMFN", title: "Amazon listing evidence", text: "8 weeks 2.85-inch slim edge expansion brush LiDAR pet hair", rating: 0 }],
    language: "zh-CN"
  });

  const ilife = generateFallbackReport({
    competitorGroup: "Amazon: B0G5YDVR99",
    products: [{
      id: "B0G5YDVR99",
      brand: "ILIFE",
      name: "ILIFE A30s 10000Pa Robot Vacuum LiDAR No-Go Zone Voice and Remote Control Vacuum only no mopping function",
      price: 0,
      rating: 0,
      reviewCount: 0,
      features: ["10000Pa suction", "LiDAR", "voice and remote control", "vacuum only, no mopping function"]
    }],
    reviews: [{ productId: "B0G5YDVR99", title: "Amazon listing evidence", text: "10000Pa LiDAR voice remote control vacuum only no mopping function pet hair", rating: 0 }],
    language: "zh-CN"
  });

  assert.match(shark.gtmActions.join(" "), /sonic mopping|HEPA|过敏原/);
  assert.match(eufy.gtmActions.join(" "), /超薄|边角|扩展边刷/);
  assert.match(ilife.gtmActions.join(" "), /10000Pa|仅吸尘|no mopping/);
  assert.doesNotMatch(ilife.gtmActions.join(" "), /厨房污渍、脚印、水痕控制/);
});

function reportForGroup(groupId) {
  const group = sampleCompetitorGroups.find((item) => item.id === groupId);
  const ids = new Set(group.productIds);
  return generateFallbackReport({
    competitorGroup: group.name,
    products: sampleProducts.filter((product) => ids.has(product.id)),
    reviews: sampleReviews.filter((review) => ids.has(review.productId)),
    language: "zh-CN"
  });
}
