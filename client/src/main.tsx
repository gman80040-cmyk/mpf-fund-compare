import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
if("serviceWorker" in navigator){if(import.meta.env.PROD){window.addEventListener("load",()=>navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(()=>undefined));}else{navigator.serviceWorker.getRegistrations().then((registrations)=>registrations.forEach((registration)=>registration.unregister()));}}
createRoot(document.getElementById("root")!).render(<App/>);
