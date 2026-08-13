# 貢獻指南

MPF Fund Compare 是一個以公開資料核對強積金基金的社群專案。貢獻應提升資料可追溯性、可用性、無障礙或工程品質，而不是形成投資推薦。

## 變更原則

| 可以提交 | 不應提交 |
| --- | --- |
| 有官方來源支持的資料校正、雙語改善、測試、無障礙、效能與 PWA 改進。 | 基金買賣建議、未經核對數據、個人帳戶資料、偽造評論、追蹤碼或使用者分析。 |
| 可重現的問題與修正步驟。 | 聲稱資料為實時，或以回報排名暗示投資結果。 |

## 本機驗證

請先安裝 Node.js 22 與 pnpm 10，然後執行：

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm run lint
pnpm run build
```

資料更新須遵守 [`docs/monthly-update-checklist.md`](docs/monthly-update-checklist.md)，並在 Pull Request 提供資料截至月份、官方來源與差異摘要。

## Pull Request 準則

請聚焦一個可審核的目標，使用清晰標題，並保留現有中英雙語、資料截至標籤、免責聲明及不推薦基金的原則。大圖、生成資產及任何非程式執行期檔案應避免加入網站部署目錄。
