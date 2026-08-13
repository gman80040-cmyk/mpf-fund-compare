/** 港島理財報章：全站使用固定淺色資料底稿與清晰返回路徑。 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense, useEffect } from "react";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { LocaleProvider } from "./contexts/LocaleContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./styles/register.css";
import "./styles/enhancements.css";
import { PwaUpdateNotice } from "./components/PwaUpdateNotice";
const Home=lazy(()=>import("./pages/Home"));const FundDetail=lazy(()=>import("./pages/FundDetail"));const Compare=lazy(()=>import("./pages/Compare"));const Guide=lazy(()=>import("./pages/Guide"));const NotFound=lazy(()=>import("./pages/NotFound"));
function Router(){return <Suspense fallback={<main className="page-loading">Loading public fund data…</main>}><Switch><Route path="/" component={Home}/><Route path="/guide" component={Guide}/><Route path="/fund/:id" component={FundDetail}/><Route path="/compare" component={Compare}/><Route path="/404" component={NotFound}/><Route component={NotFound}/></Switch></Suspense>;}
function App(){useEffect(()=>{const route=sessionStorage.getItem("mpf-spa-route");if(route){sessionStorage.removeItem("mpf-spa-route");window.history.replaceState(null,"",route);window.dispatchEvent(new PopStateEvent("popstate"));}},[]);return <ErrorBoundary><ThemeProvider defaultTheme="light"><LocaleProvider><TooltipProvider><Toaster/><WouterRouter base={import.meta.env.BASE_URL}><Router/><PwaUpdateNotice/></WouterRouter></TooltipProvider></LocaleProvider></ThemeProvider></ErrorBoundary>;}
export default App;
