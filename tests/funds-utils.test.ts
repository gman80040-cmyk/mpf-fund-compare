import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { buildFundsCsv, filterFunds, getPeerRank, getPeers, getSubcategories, sortFunds, type Fund } from "../client/src/lib/funds.ts";

const document = JSON.parse(await readFile(new URL("../data/funds.json", import.meta.url), "utf8")) as { funds: Fund[] };
const funds = document.funds;

test("search supports bilingual names, provider and scheme terms", () => {
  assert.ok(filterFunds(funds, "美洲基金", "all", "all").some((fund) => fund.fund_id === "mpfa-878"));
  assert.ok(filterFunds(funds, "AIA", "all", "all").every((fund) => fund.provider === "AIA"));
  assert.ok(filterFunds(funds, "MPF", "all", "all").length > 0);
});

test("official subcategories are derived consistently and narrow result sets", () => {
  const subcategories = getSubcategories(funds, "zh-Hant", "equity");
  const america = subcategories.find(([id]) => id === "股票基金 - 美國股票基金");
  assert.ok(america);
  const results = filterFunds(funds, "", "equity", america![0]);
  assert.equal(results.length, 8);
  assert.ok(results.every((fund) => fund.asset_category["zh-Hant"] === america![0]));
});

test("peer ranking supports asset class and exact fund subcategory scopes", () => {
  const fund = funds.find((candidate) => candidate.fund_id === "mpfa-878")!;
  const broad = getPeerRank(fund, funds, "asset_class");
  const narrow = getPeerRank(fund, funds, "asset_category");
  assert.equal(broad.total, 116);
  assert.equal(narrow.total, 8);
  assert.equal(getPeers(fund, funds, "asset_category").length, 8);
});

test("sorting and CSV export preserve public data fields and protect spreadsheet formulas", () => {
  const selected = funds.filter((fund) => ["mpfa-878", "mpfa-875", "mpfa-137"].includes(fund.fund_id));
  const byFer = sortFunds(selected, funds, "en", "fer");
  assert.deepEqual(byFer.map((fund) => fund.fund_id), ["mpfa-875", "mpfa-878", "mpfa-137"]);
  const csv = buildFundsCsv(selected, funds, "zh-Hant");
  assert.match(csv, /基金細分類/);
  assert.match(csv, /https:\/\/mfp\.mpfa\.org\.hk/);
  assert.match(csv, /^\uFEFF/m);
});
