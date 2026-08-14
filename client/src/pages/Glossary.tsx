/** 港島理財報章：詞典頁以定義、來源與限制分欄；搜尋列保持資料索引的克制報章語氣，不把結果包裝成推薦。 */
import { BookOpenCheck, ExternalLink, FileText, HelpCircle, Scale, Search, ShieldAlert, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { Footer, Header } from "@/components/SiteFrame";
import { useLocale } from "@/contexts/LocaleContext";
import { useFunds } from "@/lib/funds";
import "@/styles/guide.css";
import "@/styles/glossary-search.css";

type Term = { term: string; label: string; body: string; source?: string; aliases: string[] };
type Faq = { question: string; answer: string };

export default function Glossary() {
  const { locale } = useLocale();
  const { document } = useFunds();
  const [query, setQuery] = useState("");
  const zh = locale === "zh-Hant";

  const terms: Term[] = zh ? [
    { term: "年率化回報", label: "Annualised return", body: "把連續多年期的回報按複利效果換算為平均 12 個月回報；它不是把累積回報直接除以年數。", source: "MPF Fund Platform", aliases: ["annualised return", "annualized return", "annualised", "annualized", "annual return", "年化", "年率"] },
    { term: "基金開支比率（FER）", label: "Fund expense ratio", body: "以基金規模百分比表達的基金開支資料。它按上一個財政期計算，刊載數字未必反映本財政期收費變動。", source: "MPF Fund Platform", aliases: ["FER", "fund expense ratio", "expense ratio", "基金費用", "開支", "收費"] },
    { term: "風險級別", label: "Risk class", body: "本網站顯示的風險級別屬比較欄目之一。應連同基金目標、資產類別、基金便覽及最新受託人資料閱讀。", source: "Fund Fact Sheet", aliases: ["risk class", "risk", "風險"] },
    { term: "同類 5 年排名", label: "5-year peer rank", body: "本工具按所選同類範圍內的 5 年年率化回報排列。它是資料排序，不是基金質素評級或任何推薦。", aliases: ["5-year peer rank", "peer rank", "ranking", "同類排名", "排名"] },
    { term: "成分基金", label: "Constituent fund", body: "組成強積金計劃的投資基金。某些成分基金可有不同基金類別，平台可分別展示。", source: "MPF Fund Platform", aliases: ["constituent fund", "constituent", "fund class", "基金類別"] },
    { term: "基金便覽", label: "Fund fact sheet", body: "定期提供基金規模、投資目標、資產配置、表現、FER 與風險資料等概要的官方文件。", source: "MPF Fund Platform", aliases: ["fund fact sheet", "fact sheet", "factsheet", "fund size", "資產配置"] },
    { term: "預設投資策略（DIS）", label: "Default Investment Strategy", body: "DIS 由核心累積基金及 65 歲後基金組成，設有自動降低風險、費用上限及全球分散投資等安排；它們並非保本或保證回報。", source: "MPFA", aliases: ["DIS", "default investment strategy", "core accumulation fund", "age 65 plus fund", "核心累積基金", "65 歲後基金", "保本"] },
    { term: "資料截至", label: "Data as of", body: "本網站是每月核對後的公開資料快照，不是即時報價。使用前先看資料月份，並以最新官方文件為準。", aliases: ["data as of", "data month", "資料月份", "更新", "snapshot", "即時"] },
  ] : [
    { term: "Annualised return", label: "Annualised return", body: "An average 12-month return over consecutive years that reflects compounding. It is not the cumulative return divided by the number of years.", source: "MPF Fund Platform", aliases: ["annualized return", "annual return", "年率化回報", "年化", "年率"] },
    { term: "Fund expense ratio (FER)", label: "Fund expense ratio", body: "A fund-expense figure expressed as a percentage of fund size. It uses the previous financial period and may not reflect current-period fee changes.", source: "MPF Fund Platform", aliases: ["FER", "expense ratio", "基金開支比率", "基金費用", "開支", "收費"] },
    { term: "Risk class", label: "Risk class", body: "The risk class displayed here is one comparison field. Read it with the fund objective, asset class, fact sheet and current trustee information.", source: "Fund Fact Sheet", aliases: ["risk", "風險級別", "風險"] },
    { term: "5-year peer rank", label: "5-year peer rank", body: "This tool orders 5-year annualised returns within the selected peer scope. It is a data ordering, not a quality rating or recommendation.", aliases: ["peer rank", "ranking", "同類 5 年排名", "同類排名", "排名"] },
    { term: "Constituent fund", label: "Constituent fund", body: "An investment fund that forms part of an MPF scheme. A constituent fund may have different fund classes, which can be displayed separately.", source: "MPF Fund Platform", aliases: ["fund class", "成分基金", "基金類別"] },
    { term: "Fund fact sheet", label: "Fund fact sheet", body: "An official summary document covering items such as fund size, objective, portfolio allocation, performance, FER and risk information.", source: "MPF Fund Platform", aliases: ["fact sheet", "factsheet", "基金便覽", "基金規模", "資產配置"] },
    { term: "Default Investment Strategy (DIS)", label: "Default Investment Strategy", body: "DIS uses the Core Accumulation Fund and Age 65 Plus Fund, with automatic de-risking, fee caps and global diversification. Neither fund guarantees capital or returns.", source: "MPFA", aliases: ["DIS", "Core Accumulation Fund", "Age 65 Plus Fund", "預設投資策略", "核心累積基金", "65 歲後基金", "保本"] },
    { term: "Data as of", label: "Data as of", body: "This site is a monthly reviewed public-data snapshot, not a live-price service. Check the data month and verify against current official documents.", aliases: ["data month", "snapshot", "資料截至", "資料月份", "更新", "即時"] },
  ];

  const faqs: Faq[] = zh ? [
    { question: "為何 1 年回報較高，5 年同類排名卻不一定較前？", answer: "本工具的同類排名以 5 年年率化回報計算，並只在所選資產類別或細分類內比較。不同期間的回報回答的是不同問題，因此不應以單一欄目代替完整核對。" },
    { question: "FER 較低是否代表一定較合適？", answer: "不是。FER 可協助比較過往財政期的基金開支，但基金目標、風險、資產類別、計劃文件及你的實際情況都不同。網站不會因為任何單一數字作出推薦。" },
    { question: "DIS 是否等於保本？", answer: "不是。DIS 有自動降低風險、費用上限及分散投資等特點，但核心累積基金與 65 歲後基金的價格可升可跌，並非資本或回報保證。" },
    { question: "這個網站何時更新？", answer: "資料按月度流程由官方公開資料人手核對，完成雙語基金 ID、差異摘要及測試後，以 Pull Request 審核及發布。資料版本頁會保留快照記錄。" },
  ] : [
    { question: "Why can a higher 1-year return sit with a lower 5-year peer rank?", answer: "The peer rank on this site uses 5-year annualised return and only the selected asset-class or subcategory scope. Different return periods answer different questions; one field should not replace a full check." },
    { question: "Does a lower FER mean a fund is necessarily more suitable?", answer: "No. FER helps compare past-period fund expenses, but objectives, risk, asset class, scheme documents and personal circumstances differ. This site does not recommend a fund from any single number." },
    { question: "Is DIS capital-guaranteed?", answer: "No. DIS has automatic de-risking, fee caps and diversification features, but the Core Accumulation Fund and Age 65 Plus Fund can rise or fall and do not guarantee capital or returns." },
    { question: "When is this site updated?", answer: "Data follows a monthly, human-reviewed public-data process. Bilingual fund IDs, a change summary and tests are checked before a Pull Request review and release. The version page retains the snapshot record." },
  ];

  const content = zh ? {
    eyebrow: "MPF 資料閱讀工具", title: "先讀懂欄目，\n再看比較。", intro: "小詞典只解釋公開資料與文件用途；數字、排名和費用不等於個人化建議。", terms: "術語小詞典", questions: "常見問題", sources: "回到官方來源", sourceText: "涉及基金選擇或資料差異時，請以受託人文件、基金便覽和積金局最新資料為準。", guide: "返回新手傻瓜包", warning: "本頁只作教育及資訊用途，不構成投資建議。", searchLabel: "搜尋術語", searchPlaceholder: "輸入中文、英文、縮寫或定義字眼", searchHint: "例如：FER、年率化、DIS、費用", clear: "清除搜尋", results: (count: number, hasQuery: boolean) => hasQuery ? `找到 ${count} 項相關術語` : `共 ${count} 個術語`, noResults: "找不到相關術語", noResultsText: "請嘗試中文、英文、縮寫或其他定義字眼。",
  } : {
    eyebrow: "MPF reading desk", title: "Understand the fields\nbefore the comparison.", intro: "This glossary explains public data and document uses only; figures, ranks and fees do not become personalised advice.", terms: "Glossary", questions: "Frequently asked questions", sources: "Return to official sources", sourceText: "For a fund choice or a data discrepancy, use current trustee documents, fact sheets and MPFA information as the reference point.", guide: "Back to starter guide", warning: "This page is for education and information only; it is not investment advice.", searchLabel: "Search terms", searchPlaceholder: "Search Chinese, English, abbreviations or definitions", searchHint: "For example: FER, annualised, DIS, fees", clear: "Clear search", results: (count: number, hasQuery: boolean) => hasQuery ? `${count} matching terms` : `${count} terms in this glossary`, noResults: "No matching terms", noResultsText: "Try a Chinese or English name, an abbreviation, or a different word from the definition.",
  };

  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredTerms = terms.filter((item) => [item.term, item.label, item.body, item.source ?? "", ...item.aliases].join(" ").toLocaleLowerCase().includes(normalizedQuery));
  const dateline = zh ? `第 02 期 · 詞彙編 · 資料截至 ${document?.as_of ?? "—"}` : `Issue 02 · Terms desk · Data as of ${document?.as_of ?? "—"}`;

  return <div className="min-h-screen page-shell">
    <Header asOf={document?.as_of}/>
    <main>
      <section className="guide-hero glossary-hero">
        <div className="guide-hero-stamp">MPF / TERMS</div>
        <div className="frame guide-hero-grid">
          <div>
            <p className="eyebrow">{content.eyebrow}</p>
            <p className="guide-dateline">{dateline}</p>
            <h1>{content.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h1>
            <p>{content.intro}</p>
            <Link href="/guide" className="guide-primary-link">{content.guide}<BookOpenCheck size={16}/></Link>
          </div>
          <aside>
            <Scale size={23}/>
            <strong>{zh ? "比較規則" : "Comparison rule"}</strong>
            <p>{zh ? "先確認資料月份、期間與同類範圍；再理解數字的意思。" : "Confirm the data month, period and peer scope before interpreting a figure."}</p>
          </aside>
        </div>
      </section>

      <section className="frame glossary-layout">
        <div>
          <div className="guide-section-heading">
            <div><p className="eyebrow">{content.terms}</p><p className="guide-dateline guide-dateline-light">{dateline}</p></div>
            <h2>{zh ? "把常見欄目放進同一套閱讀語境。" : "Place common fields in one reading context."}</h2>
          </div>
          <div className="glossary-search" role="search">
            <label htmlFor="glossary-search-input">{content.searchLabel}</label>
            <div className="glossary-search-field">
              <Search aria-hidden="true" size={19}/>
              <input id="glossary-search-input" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={content.searchPlaceholder} aria-describedby="glossary-search-hint glossary-search-results" autoComplete="off" />
              {query ? <button type="button" onClick={() => setQuery("")} aria-label={content.clear} title={content.clear}><X size={17}/></button> : null}
            </div>
            <div className="glossary-search-meta"><p id="glossary-search-hint">{content.searchHint}</p><p id="glossary-search-results" aria-live="polite">{content.results(filteredTerms.length, Boolean(normalizedQuery))}</p></div>
          </div>
          {filteredTerms.length ? <div className="term-grid">
            {filteredTerms.map((item, index) => <article className="term-entry" key={item.term}>
              <div><span>{String(index + 1).padStart(2, "0")}</span>{item.source ? <small>{item.source}</small> : null}</div>
              <h3>{item.term}</h3>
              {item.label !== item.term ? <p className="term-label">{item.label}</p> : null}
              <p>{item.body}</p>
            </article>)}
          </div> : <div className="glossary-empty" role="status">
            <Search aria-hidden="true" size={22}/><h3>{content.noResults}</h3><p>{content.noResultsText}</p>
            <button type="button" onClick={() => setQuery("")}>{content.clear}</button>
          </div>}
        </div>
        <aside className="glossary-sidebar">
          <FileText size={21}/><p className="eyebrow">{zh ? "文件邊欄" : "Document sidebar"}</p>
          <h2>{zh ? "看數字前，先找出資料期。" : "Find the data period before the number."}</h2>
          <p>{zh ? "FER 來自過往財政期；回報與風險資料亦可能有刊載時差。比較時，先對照資料截至月份及原始基金便覽。" : "FER comes from a prior financial period, while return and risk data can also have publication lags. Start with the data month and the original fund fact sheet."}</p>
          <a href="https://mfp.mpfa.org.hk/eng/mpp_glossary.jsp" target="_blank" rel="noreferrer">{zh ? "積金局基金平台詞彙" : "MPF Fund Platform glossary"}<ExternalLink size={14}/></a>
        </aside>
      </section>

      <section className="frame faq-section">
        <div className="guide-section-heading"><div><p className="eyebrow">{content.questions}</p><p className="guide-dateline guide-dateline-light">{zh ? "讀者提問 · 非個人化解答" : "Reader questions · non-personal answers"}</p></div><h2>{zh ? "問題先釐清，先不要急於下結論。" : "Clarify the question before drawing a conclusion."}</h2></div>
        <div className="faq-grid">{faqs.map((faq, index) => <details key={faq.question}><summary><span>{String(index + 1).padStart(2, "0")}</span>{faq.question}<HelpCircle size={18}/></summary><p>{faq.answer}</p></details>)}</div>
      </section>

      <section className="frame guide-documents glossary-sources"><div><p className="eyebrow">{content.sources}</p><h2>{zh ? "資料解釋，必須可追溯。" : "Definitions should remain traceable."}</h2><p>{content.sourceText}</p></div><div className="guide-source-links"><a href="https://mfp.mpfa.org.hk/eng/mpp_glossary.jsp" target="_blank" rel="noreferrer">MPF Fund Platform Glossary<ExternalLink size={14}/></a><a href="https://www.mpfa.org.hk/en/mpf-investment/portfolio/default-investment-strategy" target="_blank" rel="noreferrer">MPFA: Default Investment Strategy<ExternalLink size={14}/></a><a href={zh ? "https://www.ifec.org.hk/web/tc/young-adults/youth-investment/5-steps-mpf-funds.page" : "https://www.ifec.org.hk/web/en/young-adults/youth-investment/5-steps-mpf-funds.page"} target="_blank" rel="noreferrer">IFEC: Five steps to choosing MPF funds<ExternalLink size={14}/></a></div></section>
      <section className="frame guide-warning"><ShieldAlert size={20}/><p>{content.warning}</p></section>
    </main>
    <Footer asOf={document?.as_of}/>
  </div>;
}
