## 摘要

請簡短說明這個變更解決甚麼問題，以及是否會改變公開資料的顯示或比較方法。

## 資料更新（如適用）

- [ ] 我已填寫積金局資料截至月份：`YYYY-MM`。
- [ ] 我已手動核對繁體中文及英文資料列的基金 ID 對應。
- [ ] 我已以 `scripts/describe_data_change.py` 產生並檢視差異摘要。
- [ ] `data/funds.json` 與 `client/public/data/funds.json` 完全一致。
- [ ] 我沒有把資料描述為實時資料，也沒有加入基金推薦內容。

## 品質檢查

- [ ] `pnpm test`
- [ ] `pnpm run lint`
- [ ] `pnpm run build`
- [ ] 我已在桌面及手機寬度檢視受影響頁面。
