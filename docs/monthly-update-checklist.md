# 每月資料更新與審核清單

本專案的資料是積金局公開資料的**已審核時間點快照**，不是實時資料。每次更新都必須保留人手核對步驟，並以 Pull Request 形式讓其他維護者重現檢查。[1]

| 次序 | 操作 | 必須核對的結果 |
| --- | --- | --- |
| 1 | 在積金局基金資訊表記錄資料截至月份，分別匯出繁中及英文公開列。 | 兩份匯出檔均保留基金 ID，月份一致。 |
| 2 | 使用 `scripts/update_data.py` 轉換資料。 | 只保留具完整風險、FER 與 1／3／5 年回報欄位的列。 |
| 3 | 將 `data/funds.json` 同步至 `client/public/data/funds.json`。 | 兩份 JSON 二進位內容一致。 |
| 4 | 使用 `scripts/describe_data_change.py` 比較上一快照與新快照。 | 差異摘要清楚列出新增、移除及變更基金。 |
| 5 | 執行 `pnpm test && pnpm run lint && pnpm run build`。 | 所有檢查通過，再建立 Pull Request。 |
| 6 | 在 PR 填寫資料月份、官方來源及人手核對結果。 | 合併後由 Pages workflow 發布。 |

```bash
python3 scripts/describe_data_change.py \
  --before archive/funds-2026-07.json \
  --after data/funds.json \
  --output docs/data-changelog/2026-08.md
```

## References

[1]: https://mfp.mpfa.org.hk/mobile/tch/mpp_list.jsp "積金局強積金基金平台：基金資訊表"
