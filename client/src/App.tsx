/** 港島理財報章：全站使用固定淺色資料底稿與清晰返回路徑。 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { LocaleProvider } from "./contexts/LocaleContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./styles/register.css";
import Compare from "./pages/Compare";
import FundDetail from "./pages/FundDetail";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
function Router(){return <Switch><Route path="/" component={Home}/><Route path="/fund/:id" component={FundDetail}/><Route path="/compare" component={Compare}/><Route path="/404" component={NotFound}/><Route component={NotFound}/></Switch>;}
function App(){useEffect(()=>{const route=sessionStorage.getItem("mpf-spa-route");if(route){sessionStorage.removeItem("mpf-spa-route");window.history.replaceState(null,"",route);window.dispatchEvent(new PopStateEvent("popstate"));}},[]);return <ErrorBoundary><ThemeProvider defaultTheme="light"><LocaleProvider><TooltipProvider><Toaster/><Router/></TooltipProvider></LocaleProvider></ThemeProvider></ErrorBoundary>;}
export default App;
