import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
if("serviceWorker" in navigator){if(import.meta.env.PROD){window.addEventListener("load",()=>navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).then((registration)=>{const announce=()=>window.dispatchEvent(new Event("mpf-sw-update"));if(registration.waiting)announce();registration.addEventListener("updatefound",()=>{const worker=registration.installing;if(worker)worker.addEventListener("statechange",()=>{if(worker.state==="installed"&&navigator.serviceWorker.controller)announce();});});navigator.serviceWorker.addEventListener("controllerchange",()=>window.location.reload());}).catch(()=>undefined));}else{navigator.serviceWorker.getRegistrations().then((registrations)=>registrations.forEach((registration)=>registration.unregister()));}}
createRoot(document.getElementById("root")!).render(<App/>);
