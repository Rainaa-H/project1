import test from "node:test";
import assert from "node:assert/strict";
import { parseReviewCsv, parseReviewText } from "../src/shared/parsers.js";

test("parseReviewCsv maps common review columns into ReviewRecord objects", () => {
  const csv = [
    "title,text,rating,verified_purchase,helpful_vote,date",
    "\"Great for pet hair\",\"Handles dog hair well\",5,true,12,2025-03-04",
    "\"Map resets\",\"The app lost my room map twice\",2,false,8,2025-04-10"
  ].join("\n");

  const records = parseReviewCsv(csv);

  assert.equal(records.length, 2);
  assert.deepEqual(records[0], {
    title: "Great for pet hair",
    text: "Handles dog hair well",
    rating: 5,
    verifiedPurchase: true,
    helpfulVote: 12,
    date: "2025-03-04"
  });
  assert.equal(records[1].rating, 2);
  assert.equal(records[1].verifiedPurchase, false);
});

test("parseReviewText turns pasted lines into review records with default metadata", () => {
  const records = parseReviewText("Pet hair pickup is strong\nApp connection failed after update");

  assert.equal(records.length, 2);
  assert.equal(records[0].title, "粘贴评论 1");
  assert.equal(records[0].text, "Pet hair pickup is strong");
  assert.equal(records[0].rating, 3);
  assert.equal(records[0].verifiedPurchase, false);
});
