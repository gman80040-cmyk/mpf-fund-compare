/** 港島理財報章：語言切換是閱讀偏好，且只留在使用者裝置。 */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { type Locale } from "@/lib/funds";
const LocaleContext=createContext<{locale:Locale;setLocale:(locale:Locale)=>void}>({locale:"zh-Hant",setLocale:()=>undefined});
export function LocaleProvider({children}:{children:React.ReactNode}){const [locale,setLocaleState]=useState<Locale>(()=>(localStorage.getItem("mpf-locale") as Locale)||"zh-Hant"); const setLocale=(next:Locale)=>setLocaleState(next); useEffect(()=>{localStorage.setItem("mpf-locale",locale);document.documentElement.lang=locale==="en"?"en":"zh-Hant";},[locale]); const value=useMemo(()=>({locale,setLocale}),[locale]);return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;}
export function useLocale(){return useContext(LocaleContext);}
