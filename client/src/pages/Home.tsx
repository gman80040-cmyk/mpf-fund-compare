/**
 * 港島理財報章：首頁以資料專欄及來源邊欄構成；桌面是基金登記冊，手機才使用連續資料卡。
 */
import { useEffect, useMemo, useState } from "react";
import { ArrowDown, Search, SlidersHorizontal } from "lucide-react";
import { Link } from "wouter";
import { FundCard } from "@/components/FundCard";
import { FundRegister } from "@/components/FundRegister";
import { Footer, Header } from "@/components/SiteFrame";
import { assetLabels, assetOrder, copy, type AssetClass, useFunds } from "@/lib/funds";
import { useLocale } from "@/contexts/LocaleContext";
import "@/styles/register.css";

const selectionKey = "mpf-compare-selection";
export default function Home() {
  const { document, loading, error } = useFunds(); const { locale } = useLocale(); const t = copy[locale];
  const [query, setQuery] = useState(""); const [category, setCategory] = useState<AssetClass | "all">("all"); const [subcategory, setSubcategory] = useState("all");
  const [selected, setSelected] = useState<string[]>(() => JSON.parse(localStorage.getItem(selectionKey) || "[]"));
  useEffect(() => localStorage.setItem(selectionKey, JSON.stringify(selected)), [selected]);
  const funds = document?.funds || [];
  const subcategories = useMemo(() => Array.from(new Map(funds.filter((fund) => category === "all" || fund.asset_class === category).map((fund) => [fund.asset_category["zh-Hant"], fund.asset_category[locale]])).entries()).sort((a, b) => a[1].localeCompare(b[1], locale === "en" ? "en" : "zh-Hant")), [funds, category, locale]);
  const filtered = useMemo(() => funds.filter((fund) => { const searchText = [fund.name["zh-Hant"], fund.name.en, fund.provider, fund.scheme["zh-Hant"], fund.scheme.en].join(" ").toLowerCase(); return (category === "all" || fund.asset_class === category) && (subcategory === "all" || fund.asset_category["zh-Hant"] === subcategory) && searchText.includes(query.trim().toLowerCase()); }), [funds, query, category, subcategory]);
  const displayed = filtered.slice(0, 72);
  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((value) => value !== id) : current.length < 3 ? [...current, id] : current);
  return <div className="min-h-screen page-shell"><Header asOf={document?.as_of} selectedCount={selected.length} /><main>
    <section className="hero"><div className="hero-texture" /><div className="frame hero-grid"><div className="hero-copy"><p className="eyebrow">{t.editorial}</p><h1>{t.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h1><p>{t.intro}</p><a href="#fund-search" className="hero-scroll">{t.home}<ArrowDown size={16} /></a></div><aside className="hero-note"><span>{t.dataAsOf}</span><strong>{document?.as_of || "2026-07"}</strong><p>{t.sourceLine}</p><img src="/manus-storage/mpf-compare-still-life_8c012149.png" alt="" /></aside></div></section>
    <section className="frame search-section" id="fund-search"><div className="section-intro"><p className="eyebrow">01 / {locale === "en" ? "Find a fund" : "尋找基金"}</p><h2>{locale === "en" ? "Search first. Compare with context." : "先搜尋，再以同類基準比較。"}</h2></div><div className="search-control"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchPlaceholder} aria-label={t.searchPlaceholder} /><span>{t.searchHint}</span></div><div className="filter-row"><div className="filter-label"><SlidersHorizontal size={15} />{locale === "en" ? "Asset class" : "資產類別"}</div><div className="filter-pills"><button onClick={() => { setCategory("all"); setSubcategory("all"); }} className={category === "all" ? "filter-pill is-selected" : "filter-pill"}>{t.all}</button>{assetOrder.map((value) => <button key={value} onClick={() => { setCategory(value); setSubcategory("all"); }} className={category === value ? "filter-pill is-selected" : "filter-pill"}>{assetLabels[value][locale]}</button>)}</div></div><div className="filter-row subcategory-row"><div className="filter-label"><SlidersHorizontal size={15} />{t.subcategory}</div><div className="filter-pills"><button onClick={() => setSubcategory("all")} className={subcategory === "all" ? "filter-pill is-selected" : "filter-pill"}>{t.allSubcategories}</button>{subcategories.map(([id, label]) => <button key={id} onClick={() => setSubcategory(id)} className={subcategory === id ? "filter-pill is-selected" : "filter-pill"}>{label}</button>)}</div></div></section>
    <section className="frame results-section"><div className="results-heading"><div><p className="eyebrow">02 / {locale === "en" ? "Results" : "搜尋結果"}</p><h2>{filtered.length} <span>{t.results}</span></h2></div><aside className="results-context"><strong>{locale === "en" ? "Comparison basis" : "比較基準"}</strong><p>{locale === "en" ? `Same asset class · 5-year annualised return · data ${document?.as_of || "—"}` : `同一資產類別 · 5 年年率化回報 · 數據截至 ${document?.as_of || "—"}`}</p></aside></div>
      {loading ? <div className="loading-state">Loading public fund data…</div> : error ? <div className="empty-state">Unable to load the offline dataset.</div> : displayed.length ? <><FundRegister funds={displayed} allFunds={funds} selected={selected} onToggle={toggle} asOf={document?.as_of} /><div className="mobile-results"><div className="fund-grid">{displayed.map((fund) => <FundCard key={fund.fund_id} fund={fund} funds={funds} selected={selected.includes(fund.fund_id)} onToggle={() => toggle(fund.fund_id)} />)}</div></div></> : <div className="empty-state">{t.searchEmpty}</div>}
    </section>
  </main>{selected.length ? <div className="compare-tray"><div><span>{t.selected}</span><b>{selected.length} / 3</b></div><Link href="/compare">{t.compareNow}</Link></div> : null}<Footer asOf={document?.as_of} /></div>;
}
