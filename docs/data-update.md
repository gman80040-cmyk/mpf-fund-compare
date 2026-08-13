# 資料更新手冊

本專案只保存積金局公開資料的**時間點快照**，不會自動下載或宣稱提供實時資料。更新資料時，請以積金局強積金基金平台「基金資訊表」的繁體中文及英文版本為準。[1]

| 步驟 | 操作 | 核對項目 |
| --- | --- | --- |
| 1 | 在官方基金資訊表選取基金或計劃並記錄「最新資料截至」日期。 | 僅使用官方公開欄位。 |
| 2 | 分別匯出繁中與英文列，保留 `id` 及表格 `cells`。 | 同一基金 ID 必須在兩種語言版本出現。 |
| 3 | 使用 `scripts/update_data.py` 指定兩組匯出檔與 `--as-of YYYY-MM`。 | 無風險級別、FER 或 1／3／5 年回報的列會略過。 |
| 4 | 將輸出的 `data/funds.json` 同步至 `client/public/data/funds.json`。 | 兩份檔案內容應一致。 |
| 5 | 執行資料測試及靜態建置。 | `pnpm test && pnpm run lint && pnpm run build` 必須通過。 |

```bash
python3 scripts/update_data.py --tch raw/tch.json --eng raw/eng.json --output data/funds.json --as-of 2026-08
cp data/funds.json client/public/data/funds.json
pnpm test
```

基金類別按官方中文類別首段映射為 `equity`、`bond`、`mixed`、`money_market`、`guaranteed` 或 `dis_core`。系統不會依回報或收費自動判定「較好」基金；同類排名只按該資產類別中的 5 年年率化回報計算。

## References

[1]: https://mfp.mpfa.org.hk/mobile/tch/mpp_list.jsp "積金局強積金基金平台：基金資訊表"
