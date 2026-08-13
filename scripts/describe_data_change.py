#!/usr/bin/env python3
"""Describe a reviewed change between two MPFA fund-data snapshots.

This helper is deliberately offline and deterministic. It never downloads public
data and does not imply that the website is real-time. Use it after the manual
MPFA bilingual export and schema test described in README.md.
"""
from __future__ import annotations

import argparse
import json
from collections import Counter
from pathlib import Path


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def changes(before: dict, after: dict) -> tuple[list[str], list[str], list[str]]:
    old = {fund["fund_id"]: fund for fund in before["funds"]}
    new = {fund["fund_id"]: fund for fund in after["funds"]}
    added = sorted(set(new) - set(old))
    removed = sorted(set(old) - set(new))
    changed = sorted(fund_id for fund_id in set(old) & set(new) if old[fund_id] != new[fund_id])
    return added, removed, changed


def display(fund: dict) -> str:
    return f"{fund['provider']} — {fund['name']['zh-Hant']} ({fund['source_fund_id']})"


def main() -> None:
    parser = argparse.ArgumentParser(description="Create a Markdown summary of two MPFA fund snapshots")
    parser.add_argument("--before", type=Path, required=True, help="Reviewed prior funds.json")
    parser.add_argument("--after", type=Path, required=True, help="Reviewed new funds.json")
    parser.add_argument("--output", type=Path, required=True, help="Markdown summary destination")
    args = parser.parse_args()
    before, after = load(args.before), load(args.after)
    added, removed, changed = changes(before, after)
    categories = Counter(fund["asset_class"] for fund in after["funds"])
    lines = [
        f"# 資料變更摘要：{before['as_of']} → {after['as_of']}",
        "",
        "> 本摘要只比較兩個已人手核對的積金局公開資料快照，不代表實時資料。",
        "",
        "| 指標 | 數值 |",
        "| --- | ---: |",
        f"| 更新前基金數目 | {len(before['funds'])} |",
        f"| 更新後基金數目 | {len(after['funds'])} |",
        f"| 新增基金 | {len(added)} |",
        f"| 移除基金 | {len(removed)} |",
        f"| 欄位或數值變更基金 | {len(changed)} |",
        "",
        "## 更新後資產類別分布",
        "",
        "| 類別代碼 | 基金數目 |",
        "| --- | ---: |",
        *[f"| {asset_class} | {count} |" for asset_class, count in sorted(categories.items())],
    ]
    for title, ids, source in (("新增基金", added, after), ("移除基金", removed, before), ("已更新基金", changed, after)):
        lines.extend(["", f"## {title}", ""])
        if not ids:
            lines.append("沒有。")
        else:
            lines.extend(f"- {display(source['funds'][next(i for i, value in enumerate(source['funds']) if value['fund_id'] == fund_id)])}" for fund_id in ids)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {args.output}")


if __name__ == "__main__":
    main()
