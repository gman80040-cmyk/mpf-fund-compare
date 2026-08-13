/** 港島理財報章：離線更新提示像校對後的資料附箋，只在新版快取可用時出現。 */
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { copy } from "@/lib/funds";

export function PwaUpdateNotice(){const [ready,setReady]=useState(false);const {locale}=useLocale();const t=copy[locale];useEffect(()=>{const onUpdate=()=>setReady(true);window.addEventListener("mpf-sw-update",onUpdate);return()=>window.removeEventListener("mpf-sw-update",onUpdate);},[]);if(!ready)return null;const refresh=async()=>{const registration=await navigator.serviceWorker.getRegistration();if(registration?.waiting)registration.waiting.postMessage({type:"SKIP_WAITING"});else window.location.reload();};return <aside className="pwa-update" role="status"><RefreshCw size={16}/><span>{t.updateReady}</span><button onClick={refresh}>{t.refreshNow}</button></aside>;}
