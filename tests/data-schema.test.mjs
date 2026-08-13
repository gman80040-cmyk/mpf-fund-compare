import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const document = JSON.parse(await readFile(new URL("../data/funds.json", import.meta.url), "utf8"));
const required = ["fund_id", "source_fund_id", "name", "provider", "scheme", "trustee", "asset_class", "asset_category", "risk_level", "returns", "fer", "inception_date", "as_of", "source"];
const assetClasses = new Set(["equity", "bond", "mixed", "money_market", "guaranteed", "dis_core"]);

test("fund document has a declared schema and a minimum 80-fund public seed dataset", () => {
  assert.equal(document.schema_version, "1.0.0");
  assert.match(document.as_of, /^\d{4}-\d{2}$/);
  assert.ok(Array.isArray(document.funds));
  assert.ok(document.funds.length >= 80, `expected >= 80 funds, received ${document.funds.length}`);
});

test("every fund contains complete bilingual and auditable fields", () => {
  const ids = new Set();
  for (const fund of document.funds) {
    for (const key of required) assert.ok(key in fund, `${fund.fund_id} lacks ${key}`);
    assert.ok(!ids.has(fund.fund_id), `duplicate fund_id: ${fund.fund_id}`); ids.add(fund.fund_id);
    assert.ok(fund.name["zh-Hant"].trim() && fund.name.en.trim(), `${fund.fund_id} lacks bilingual name`);
    assert.ok(fund.scheme["zh-Hant"].trim() && fund.scheme.en.trim(), `${fund.fund_id} lacks bilingual scheme`);
    assert.ok(assetClasses.has(fund.asset_class), `${fund.fund_id} uses an unknown asset class`);
    assert.match(fund.inception_date, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(fund.as_of, document.as_of);
    assert.match(fund.source, /^https:\/\//);
  }
});

test("returns, expense ratios and risk classes are numeric and within reasonable presentation bounds", () => {
  for (const fund of document.funds) {
    for (const [period, value] of Object.entries(fund.returns)) {
      assert.equal(typeof value, "number", `${fund.fund_id} ${period} must be numeric`);
      assert.ok(Number.isFinite(value) && value >= -100 && value <= 100, `${fund.fund_id} ${period} outside -100% to 100%`);
    }
    assert.ok(Number.isFinite(fund.fer) && fund.fer >= 0 && fund.fer <= 5, `${fund.fund_id} FER out of range`);
    assert.ok(Number.isInteger(fund.risk_level) && fund.risk_level >= 1 && fund.risk_level <= 6, `${fund.fund_id} risk level out of range`);
  }
});
