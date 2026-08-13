/**
 * 港島理財報章：桌面結果像公開基金登記冊；欄位對齊、數字中性、比較基準可見。
 */
import { Check, Plus } from "lucide-react";
import { Link } from "wouter";
import { assetLabels, copy, formatFer, formatPercent, getPeerRank, type Fund } from "@/lib/funds";
import { useLocale } from "@/contexts/LocaleContext";

export function FundRegister({ funds, allFunds, selected, onToggle, asOf }: { funds: Fund[]; allFunds: Fund[]; selected: string[]; onToggle: (id: string) => void; asOf?: string }) {
  const { locale } = useLocale(); const t = copy[locale];
  return <div className="fund-register" role="table" aria-label={locale === "en" ? "MPF fund register" : "強積金基金資料登記冊"}>
    <div className="fund-register-head" role="row"><span>{locale === "en" ? "Fund / scheme" : "基金／計劃"}</span><span>{locale === "en" ? "Class" : "類別"}</span><span>{t.return5}</span><span>{t.fer}</span><span>{t.rank}</span><span>{locale === "en" ? "Compare" : "比較"}</span></div>
    {funds.map((fund) => { const peer = getPeerRank(fund, allFunds); const isSelected = selected.includes(fund.fund_id); return <article className="fund-register-row" role="row" key={fund.fund_id}>
      <div className="register-fund"><span>{fund.provider}</span><Link href={`/fund/${fund.fund_id}`}>{fund.name[locale]}</Link><small>{fund.scheme[locale]}</small></div>
      <div className="register-class">{assetLabels[fund.asset_class][locale]}</div>
      <div className="register-number">{formatPercent(fund.returns.five_year)}</div>
      <div className="register-number">{formatFer(fund.fer)}</div>
      <div className="register-rank">{peer.rank}<small> / {peer.total}</small></div>
      <div><button className={isSelected ? "compare-button is-added" : "compare-button"} onClick={() => onToggle(fund.fund_id)}>{isSelected ? <Check size={15} /> : <Plus size={15} />}{isSelected ? t.added : t.add}</button></div>
    </article>; })}
    <div className="register-source-line">{locale === "en" ? `Register view · 5-year annualised return ranked within the same asset class · data ${asOf}` : `資料登記冊 · 按同一資產類別的 5 年年率化回報排名 · 數據截至 ${asOf}`}</div>
  </div>;
}
