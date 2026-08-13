/**
 * 港島理財報章：資料詞彙與計算只服務於可核對的同類比較，絕不推介基金。
 */
import { useEffect, useState } from "react";

export type Locale = "zh-Hant" | "en";
export type AssetClass = "equity" | "mixed" | "bond" | "money_market" | "guaranteed" | "dis_core";
export type PeerScope = "asset_class" | "asset_category";
export type FundSort = "name" | "five_year" | "fer" | "rank";

export interface Fund {
  fund_id: string;
  source_fund_id: string;
  name: Record<Locale, string>;
  provider: string;
  scheme: Record<Locale, string>;
  trustee: Record<Locale, string>;
  asset_class: AssetClass;
  asset_category: Record<Locale, string>;
  risk_level: number;
  returns: { one_year: number; three_year: number; five_year: number };
  fer: number;
  inception_date: string;
  as_of: string;
  source: string;
}

export interface FundsDocument { schema_version: string; as_of: string; funds: Fund[]; }
const cacheKey = "mpf-funds-document-v1";

export const copy = {
  "zh-Hant": { home:"基金資料庫", compare:"比較籃", dataAsOf:"數據截至", searchPlaceholder:"搜尋基金、供應商或計劃，例如「香港股票」", searchHint:"可搜尋中文／英文基金名、供應商、基金計劃", all:"所有類別", allSubcategories:"所有細分類", subcategory:"基金細分類", results:"隻基金", rank:"同類 5 年排名", return1:"1 年", return3:"3 年", return5:"5 年", fer:"基金開支比率", risk:"風險級別", add:"加入比較", added:"已加入", compareNow:"比較已選基金", selected:"已選", exportCsv:"下載 CSV", exportResults:"匯出結果 CSV", shareFilters:"分享篩選", linkCopied:"已複製目前連結", sort:"排序", sortName:"基金名稱", sortFiveYear:"5 年回報（高至低）", sortFer:"FER（低至高）", sortRank:"同類排名（第一至後）", peerByClass:"資產類別同儕", peerBySubcategory:"基金細分類同儕", share:"複製連結", addedToTray:"已加入比較籃", removedFromTray:"已從比較籃移除", updateReady:"已有較新離線版本可用", refreshNow:"立即更新", title:"從公開資料，\n看清你的強積金基金。", intro:"搜尋基金名稱、供應商或計劃，並以同一資產類別核對回報、開支與風險資料。", editorial:"公開資料核對工具", sourceLine:"回報已扣除收費；基金開支比率屬過往財政期資料。", viewDetail:"查看資料頁", back:"返回基金資料庫", detail:"基金資料頁", inception:"推出日期", category:"資產類別", provider:"供應商", scheme:"基金計劃", peerSet:"同類基金", insight:"資料摘要", comparison:"基金並排比較", emptyCompare:"請先從基金資料庫加入 2 至 3 隻基金。", searchEmpty:"未找到相符基金。請嘗試基金名稱、供應商或計劃名稱。", disclaimer:"本工具僅供資訊參考，不構成投資建議；數據來源為積金局公開資料，如有出入以官方為準。", privacy:"你的比較籃只儲存在此裝置，不會傳送或追蹤。", remove:"移除", returnChart:"年率化回報比較", ferChart:"基金開支比率比較", noRecommendation:"排名只反映所選同類別及所載回報數據，不代表任何推薦。", online:"離線可用", updated:"資料版本" },
  en: { home:"Fund database", compare:"Comparison tray", dataAsOf:"Data as of", searchPlaceholder:"Search a fund, provider or scheme", searchHint:"Search Chinese / English fund name, provider or scheme", all:"All categories", allSubcategories:"All subcategories", subcategory:"Fund subcategory", results:"funds", rank:"5-year peer rank", return1:"1Y", return3:"3Y", return5:"5Y", fer:"Fund expense ratio", risk:"Risk class", add:"Add to compare", added:"Added", compareNow:"Compare selected funds", selected:"selected", exportCsv:"Download CSV", exportResults:"Export results CSV", shareFilters:"Share filters", linkCopied:"Current link copied", sort:"Sort", sortName:"Fund name", sortFiveYear:"5Y return (high to low)", sortFer:"FER (low to high)", sortRank:"Peer rank (best first)", peerByClass:"Asset-class peers", peerBySubcategory:"Fund-subcategory peers", share:"Copy link", addedToTray:"Added to comparison tray", removedFromTray:"Removed from comparison tray", updateReady:"A newer offline version is ready", refreshNow:"Refresh now", title:"See your MPF fund\nthrough public data.", intro:"Search funds, providers and schemes; compare return, expense and risk data within the same asset class.", editorial:"A public-data checking tool", sourceLine:"Returns are net of fees. FER reflects a prior financial period.", viewDetail:"View data sheet", back:"Back to fund database", detail:"Fund data sheet", inception:"Launch date", category:"Asset class", provider:"Provider", scheme:"Scheme", peerSet:"Peer funds", insight:"Data note", comparison:"Compare funds side by side", emptyCompare:"Add 2–3 funds from the fund database first.", searchEmpty:"No matching fund found. Try a fund, provider or scheme name.", disclaimer:"This tool is for information only and does not constitute investment advice. Data is based on public MPFA information; official information prevails in case of discrepancy.", privacy:"Your comparison tray stays on this device. No data is sent or tracked.", remove:"Remove", returnChart:"Annualised return comparison", ferChart:"Fund expense ratio comparison", noRecommendation:"Ranking only reflects the included peer set and return data; it is not a recommendation.", online:"Offline-ready", updated:"Dataset version" },
} as const;

export const assetLabels: Record<AssetClass, Record<Locale, string>> = {
  equity:{"zh-Hant":"股票",en:"Equity"}, bond:{"zh-Hant":"債券",en:"Bond"}, mixed:{"zh-Hant":"混合",en:"Mixed assets"}, money_market:{"zh-Hant":"貨幣市場",en:"Money market"}, guaranteed:{"zh-Hant":"保證",en:"Guaranteed"}, dis_core:{"zh-Hant":"DIS 核心",en:"DIS"},
};
export const assetOrder: AssetClass[] = ["equity","bond","mixed","money_market","guaranteed","dis_core"];

export async function getFundsDocument(): Promise<FundsDocument> {
  const inMemory = sessionStorage.getItem(cacheKey);
  if (inMemory) return JSON.parse(inMemory) as FundsDocument;
  const response = await fetch(`${import.meta.env.BASE_URL}data/funds.json`);
  if (!response.ok) throw new Error("Unable to load MPF data");
  const data = (await response.json()) as FundsDocument;
  sessionStorage.setItem(cacheKey, JSON.stringify(data));
  return data;
}
export function useFunds() { const [document,setDocument]=useState<FundsDocument|null>(null); const [error,setError]=useState(false); useEffect(()=>{getFundsDocument().then(setDocument).catch(()=>setError(true));},[]); return {document,loading:!document&&!error,error}; }
export function getPeers(fund: Fund, funds: Fund[], scope: PeerScope = "asset_class") { return funds.filter((candidate) => scope === "asset_category" ? candidate.asset_category["zh-Hant"] === fund.asset_category["zh-Hant"] : candidate.asset_class === fund.asset_class); }
export function getPeerRank(fund: Fund, funds: Fund[], scope: PeerScope = "asset_class") { const ordered=[...getPeers(fund,funds,scope)].sort((a,b)=>b.returns.five_year-a.returns.five_year); return {rank:ordered.findIndex((candidate)=>candidate.fund_id===fund.fund_id)+1,total:ordered.length}; }
export function formatPercent(value:number,digits=2){return `${value>=0?"+":""}${value.toFixed(digits)}%`;}
export function formatFer(value:number){return `${value.toFixed(2)}%`;}
export function localDate(value:string,locale:Locale){return new Intl.DateTimeFormat(locale==="en"?"en-GB":"zh-HK",{year:"numeric",month:"short",day:"2-digit"}).format(new Date(`${value}T00:00:00`));}
export function getSubcategories(funds: Fund[], locale: Locale, category: AssetClass | "all") { return Array.from(new Map(funds.filter((fund) => category === "all" || fund.asset_class === category).map((fund) => [fund.asset_category["zh-Hant"], fund.asset_category[locale]])).entries()).sort((a,b)=>a[1].localeCompare(b[1],locale === "en" ? "en" : "zh-Hant")); }
export function filterFunds(funds: Fund[], query: string, category: AssetClass | "all", subcategory: string) { const needle=query.trim().toLowerCase(); return funds.filter((fund)=>{const text=[fund.name["zh-Hant"],fund.name.en,fund.provider,fund.scheme["zh-Hant"],fund.scheme.en].join(" ").toLowerCase();return (category==="all"||fund.asset_class===category)&&(subcategory==="all"||fund.asset_category["zh-Hant"]===subcategory)&&text.includes(needle);}); }
export function sortFunds(funds: Fund[], allFunds: Fund[], locale: Locale, sort: FundSort) { return [...funds].sort((a,b)=>sort==="name"?a.name[locale].localeCompare(b.name[locale],locale==="en"?"en":"zh-Hant"):sort==="five_year"?b.returns.five_year-a.returns.five_year:sort==="fer"?a.fer-b.fer:getPeerRank(a,allFunds).rank-getPeerRank(b,allFunds).rank); }
function escapeCsv(value: string | number) { const content = String(value).replace(/"/g, '""'); return `"${/^[=+\-@]/.test(content) ? `'${content}` : content}"`; }
export function buildFundsCsv(funds: Fund[], allFunds: Fund[], locale: Locale) {
  const headings = locale === "en" ? ["Fund ID","Fund","Provider","Scheme","Asset class","Fund subcategory","1-year annualised return","3-year annualised return","5-year annualised return","FER","Risk class","5-year peer rank","Peer total","Data as of","Official source"] : ["基金 ID","基金名稱","供應商","基金計劃","資產類別","基金細分類","1 年年率化回報","3 年年率化回報","5 年年率化回報","基金開支比率","風險級別","同類 5 年排名","同類基金數目","數據截至","官方來源"];
  const rows = funds.map((fund) => { const peer = getPeerRank(fund, allFunds); return [fund.source_fund_id, fund.name[locale], fund.provider, fund.scheme[locale], assetLabels[fund.asset_class][locale], fund.asset_category[locale], fund.returns.one_year, fund.returns.three_year, fund.returns.five_year, fund.fer, `${fund.risk_level}/6`, peer.rank, peer.total, fund.as_of, fund.source]; });
  return `\uFEFF${[headings, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n")}`;
}
export function downloadFundsCsv(funds: Fund[], allFunds: Fund[], locale: Locale, scope: "compare" | "results") { const blob = new Blob([buildFundsCsv(funds,allFunds,locale)], { type: "text/csv;charset=utf-8" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `mpf-fund-compare-${scope}-${funds.length}-funds-${funds[0]?.as_of || "data"}.csv`; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url); }
export const downloadComparisonCsv = (funds: Fund[], allFunds: Fund[], locale: Locale) => downloadFundsCsv(funds,allFunds,locale,"compare");
