#!/usr/bin/env python3
"""Convert manually exported MPFA Fund Information Table data into funds.json.

This helper intentionally performs no network request.  Download or export the
official Fund Information Table in both languages, then pass the two exported
JSON payloads to this script.  The source data remains a point-in-time public
snapshot; it is not and must not be represented as real-time data.
"""

from __future__ import annotations

import argparse
import json
from collections import Counter
from datetime import date
from pathlib import Path
from typing import Any


ASSET_CLASS = {
    "股票基金": "equity",
    "混合資產基金": "mixed",
    "債券基金": "bond",
    "貨幣市場基金": "money_market",
    "保證基金": "guaranteed",
}

PROVIDER_BY_SCHEME = {
    "AIA": "AIA",
    "BCT": "BCT",
    "BOC-Prudential": "BOC-Prudential",
    "Fidelity": "Fidelity",
    "HSBC": "HSBC",
    "Hang Seng": "HSBC",
    "Manulife": "Manulife",
    "Sun Life": "Sun Life",
    "Principal": "Principal",
    "YF Life": "YF Life",
}


def load_browser_console_export(path: Path) -> list[dict[str, Any]]:
    """Read a console export that is JSON-encoded once or twice."""
    raw = path.read_text(encoding="utf-8").strip()
    payload: Any = json.loads(raw)
    if isinstance(payload, str):
        payload = json.loads(payload)
    if not isinstance(payload, list):
        raise ValueError(f"{path} does not contain a list of records")
    return payload


def asset_class(category_zh: str) -> str:
    for prefix, canonical in ASSET_CLASS.items():
        if category_zh.startswith(prefix):
            if "預設投資策略" in category_zh:
                return "dis_core"
            return canonical
    raise ValueError(f"Unrecognised category: {category_zh}")


def provider_name(scheme_en: str, fund_name_en: str) -> str:
    if fund_name_en.startswith("Principal"):
        return "Principal"
    for needle, name in PROVIDER_BY_SCHEME.items():
        if needle.lower() in scheme_en.lower():
            return name
    return "Other"


def numeric(value: str) -> float | None:
    value = value.strip().replace(",", "")
    if value.lower() in {"n.a.", "na", ""}:
        return None
    return round(float(value), 5)


def normalise_date(value: str) -> str:
    day, month, year = value.split("-")
    return f"{year}-{month}-{day}"


def convert(tch_records: list[dict[str, Any]], eng_records: list[dict[str, Any]], as_of: str) -> list[dict[str, Any]]:
    english = {str(r["id"]): r["cells"] for r in eng_records if r.get("id")}
    result: list[dict[str, Any]] = []
    for record in tch_records:
        fund_id = str(record.get("id", ""))
        cells = record.get("cells", [])
        en = english.get(fund_id)
        if not fund_id or not en or len(cells) < 14 or len(en) < 14:
            continue
        category_zh = cells[5]
        risk_level = numeric(cells[8])
        fer = numeric(cells[9])
        returns = {
            "one_year": numeric(cells[10]),
            "three_year": numeric(cells[11]),
            "five_year": numeric(cells[12]),
        }
        if risk_level is None or fer is None or any(value is None for value in returns.values()):
            continue
        canonical_class = asset_class(category_zh)
        record_out = {
            "fund_id": f"mpfa-{fund_id}",
            "source_fund_id": fund_id,
            "name": {"zh-Hant": cells[3], "en": en[3]},
            "provider": provider_name(en[1], en[3]),
            "scheme": {"zh-Hant": cells[1], "en": en[1]},
            "trustee": {"zh-Hant": cells[4], "en": en[4]},
            "asset_class": canonical_class,
            "asset_category": {"zh-Hant": category_zh, "en": en[5]},
            "risk_level": int(risk_level),
            "returns": returns,
            "fer": fer,
            "inception_date": normalise_date(cells[6]),
            "as_of": as_of,
            "source": "https://mfp.mpfa.org.hk/mobile/tch/mpp_list.jsp",
        }
        result.append(record_out)
    return result


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert point-in-time MPFA table exports to funds.json")
    parser.add_argument("--tch", required=True, type=Path, nargs="+", help="One or more Traditional Chinese console JSON exports")
    parser.add_argument("--eng", required=True, type=Path, nargs="+", help="One or more English console JSON exports")
    parser.add_argument("--output", required=True, type=Path, help="Destination funds.json")
    parser.add_argument("--as-of", default=date.today().strftime("%Y-%m"), help="Data month, YYYY-MM")
    parser.add_argument("--limit", type=int, default=0, help="Optional maximum result count after deterministic ordering")
    args = parser.parse_args()

    tch_records = [record for path in args.tch for record in load_browser_console_export(path)]
    eng_records = [record for path in args.eng for record in load_browser_console_export(path)]
    funds = convert(tch_records, eng_records, args.as_of)
    funds_by_id = {fund["fund_id"]: fund for fund in funds}
    funds = list(funds_by_id.values())
    funds.sort(key=lambda fund: (fund["provider"], fund["scheme"]["en"], fund["name"]["en"]))
    if args.limit:
        funds = funds[: args.limit]
    document = {
        "schema_version": "1.0.0",
        "as_of": args.as_of,
        "source": {
            "name": "MPFA MPF Fund Platform",
            "url": "https://mfp.mpfa.org.hk/mobile/tch/mpp_list.jsp",
            "retrieved_at": date.today().isoformat(),
            "note": "Point-in-time public data manually exported from the MPFA Fund Information Table; not real-time data.",
        },
        "funds": funds,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(funds)} funds to {args.output}")
    print("Providers:", dict(Counter(fund["provider"] for fund in funds)))


if __name__ == "__main__":
    main()
