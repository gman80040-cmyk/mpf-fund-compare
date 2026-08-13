/** 港島理財報章：以可追溯的資料帳簿交代資料月份、記錄數與更新方法，不將資料透明度化為推銷語言。 */
import { ArrowUpRight, Database, FileCheck2, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import { useLocale } from "@/contexts/LocaleContext";
import type { FundsDocument } from "@/lib/funds";
import "@/styles/guide.css";

export function DataLedger({ document }: { document?: FundsDocument | null }) {
  const { locale } = useLocale();
  const zh = locale === "zh-Hant";
  const count = document?.funds.length ?? 0;
  const asOf = document?.as_of ?? "—";
  const content = zh
    ? { eyebrow: "資料透明度", title: "每次比較，都先看資料版本。", description: "本站只載入經核對的公開資料快照；不顯示即時報價，也不會自動改動你的基金選擇。", baseline: "最近記錄", baselineValue: `${asOf} 基線快照`, version: "資料月份", records: "雙語基金記錄", process: "查看每月核對流程", history: "查看資料版本紀錄", note: "往後的資料更新須經官方來源、差異摘要及測試核對後才會發佈。" }
    : { eyebrow: "Data transparency", title: "Start every comparison with the dataset version.", description: "This site uses reviewed public-data snapshots. It does not display live prices or change any fund selection automatically.", baseline: "Latest record", baselineValue: `${asOf} baseline snapshot`, version: "Data month", records: "Bilingual fund records", process: "View monthly review process", history: "View dataset history", note: "Future dataset changes are reviewed against official sources, a change summary and tests before release." };
  return <section className="frame ledger-section" aria-labelledby="data-ledger-title"><div className="ledger-copy"><p className="eyebrow">{content.eyebrow}</p><p className="ledger-dateline">{zh ? `第 01 期 · 公開資料快照 · ${asOf}` : `Issue 01 · Public-data snapshot · ${asOf}`}</p><h2 id="data-ledger-title">{content.title}</h2><p>{content.description}</p><div className="ledger-links"><Link href="/history" className="ledger-link">{content.history}<ArrowUpRight size={15}/></Link><a href="https://github.com/gman80040-cmyk/mpf-fund-compare/blob/main/docs/monthly-update-checklist.md" target="_blank" rel="noreferrer" className="ledger-link">{content.process}<ArrowUpRight size={15}/></a></div></div><div className="ledger-grid"><article><FileCheck2 size={18}/><span>{content.baseline}</span><strong>{content.baselineValue}</strong></article><article><RefreshCw size={18}/><span>{content.version}</span><strong>{asOf}</strong></article><article><Database size={18}/><span>{content.records}</span><strong>{count || "—"}</strong></article></div><p className="ledger-note">{content.note}</p></section>;
}
