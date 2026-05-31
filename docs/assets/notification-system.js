/*!
 * docmd (v0.8.5)
 * Copyright (c) 2025-present docmd.io
 * License: MIT
 */
"use strict";var __rest=this&&this.__rest||function(T,P){var $={};for(var v in T)Object.prototype.hasOwnProperty.call(T,v)&&P.indexOf(v)<0&&($[v]=T[v]);if(T!=null&&typeof Object.getOwnPropertySymbols=="function")for(var S=0,v=Object.getOwnPropertySymbols(T);S<v.length;S++)P.indexOf(v[S])<0&&Object.prototype.propertyIsEnumerable.call(T,v[S])&&($[v[S]]=T[v[S]]);return $};(function(){"use strict";const T={easeOutQuad:"cubic-bezier(0.25, 0.46, 0.45, 0.94)",easeOutCubic:"cubic-bezier(0.215, 0.61, 0.355, 1)",easeOutQuart:"cubic-bezier(0.165, 0.84, 0.44, 1)",easeOutQuint:"cubic-bezier(0.23, 1, 0.32, 1)",easeOutBack:"cubic-bezier(0.34, 1.56, 0.64, 1)",easeOutCirc:"cubic-bezier(0.075, 0.82, 0.165, 1)",easeInQuad:"cubic-bezier(0.55, 0.085, 0.68, 0.53)",easeInCubic:"cubic-bezier(0.55, 0.055, 0.675, 0.19)",easeInBack:"cubic-bezier(0.6, -0.28, 0.735, 0.045)",easeInOutQuad:"cubic-bezier(0.455, 0.03, 0.515, 0.955)",easeInOutCubic:"cubic-bezier(0.645, 0.045, 0.355, 1)",easeInOutBack:"cubic-bezier(0.68, -0.55, 0.265, 1.55)",linear:"linear",ease:"ease","ease-in":"ease-in","ease-out":"ease-out","ease-in-out":"ease-in-out"};function P(){class ${constructor(){this.currentNotification=null,this._lastActiveElement=null,this._currentLoadingPromise=null,this._toastContainers=new Map,this._toastInstances=new Map,this.injectStyles()}injectStyles(){const e=document.createElement("style");e.textContent=`
            .notification-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.4);
                backdrop-filter: blur(4px);
                -webkit-backdrop-filter: blur(4px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                opacity: 0;
                overflow: hidden;
            }

            .notification-box {
                background: white;
                border-radius: 16px;
                padding: 40px 30px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow: auto;
                position: relative;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                text-align: center;
                transform: scale(0.7);
                opacity: 0;
            }

            .notification-content {
                text-align: left;
                margin-bottom: 18px;
            }

            .notification-close {
                position: absolute;
                top: 10px;
                right: 10px;
                width: 38px;
                height: 38px;
                border-radius: 8px;
                border: none;
                background: rgba(0,0,0,0.06);
                color: #111827;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 18px;
            }

            .notification-close:hover {
                background: rgba(0,0,0,0.09);
            }

            /* Form controls inside the modal */
            .notification-box input,
            .notification-box textarea,
            .notification-box select {
                width: 100%;
                padding: 10px 12px;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                background: #ffffff;
                color: #111827;
                font-size: 15px;
                box-sizing: border-box;
                transition: box-shadow 0.15s ease, border-color 0.15s ease;
            }

            .notification-box input:focus,
            .notification-box textarea:focus,
            .notification-box select:focus {
                outline: none;
                border-color: #6366f1;
                box-shadow: 0 6px 24px rgba(99,102,241,0.12), 0 0 0 4px rgba(99,102,241,0.06);
            }

            .notification-box label { display: block; margin-bottom: 6px; color: #374151; font-weight: 600; }

            /* Soporte para tema oscuro con clase .dark (Tailwind darkMode: 'class') */
            /* Esto tiene prioridad sobre prefers-color-scheme para respetar la elecci\xF3n del usuario en la web */
            .dark .notification-box { background: #0f1724 !important; color: #e6eef8 !important; }
            .dark .notification-box input,
            .dark .notification-box textarea,
            .dark .notification-box select {
                background: #0b1220 !important;
                border: 1px solid rgba(255,255,255,0.06) !important;
                color: #e6eef8 !important;
            }
            .dark .notification-box .notification-close { background: rgba(255,255,255,0.03) !important; color: #e6eef8 !important; }
            .dark .notification-overlay { background-color: rgba(0,0,0,0.6) !important; }
            .dark .notification-title { color: #e6eef8 !important; }
            .dark .notification-message { color: #cbd5e1 !important; }

            /* Forzar modo claro cuando NO hay clase .dark, ignorando prefers-color-scheme */
            html:not(.dark) .notification-box { background: white !important; color: #111827 !important; }
            html:not(.dark) .notification-box input,
            html:not(.dark) .notification-box textarea,
            html:not(.dark) .notification-box select {
                background: #ffffff !important;
                border: 1px solid #e5e7eb !important;
                color: #111827 !important;
            }
            html:not(.dark) .notification-box .notification-close { background: rgba(0,0,0,0.06) !important; color: #111827 !important; }
            html:not(.dark) .notification-overlay { background-color: rgba(0, 0, 0, 0.4) !important; }
            html:not(.dark) .notification-title { color: #1f2937 !important; }
            html:not(.dark) .notification-message { color: #6b7280 !important; }

            .notification-icon {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                margin: 0 auto 25px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 40px;
                position: relative;
            }

            .notification-icon::before {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                opacity: 0.2;
            }

            .notification-icon.success {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
            }

            .notification-icon.success::before {
                background: #10b981;
            }

            .notification-icon.error {
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                color: white;
            }

            .notification-icon.error::before {
                background: #ef4444;
            }

            .notification-icon.warning {
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                color: white;
            }

            .notification-icon.warning::before {
                background: #f59e0b;
            }

            .notification-icon.info {
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                color: white;
            }

            .notification-icon.info::before {
                background: #3b82f6;
            }
            .notification-icon.question {
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                color: white;
            }

            .notification-icon.question::before {
                background: #3b82f6;
            }

            .notification-title {
                font-size: 24px;
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 12px;
                line-height: 1.3;
            }

            .notification-message {
                font-size: 16px;
                color: #6b7280;
                line-height: 1.6;
                margin-bottom: 30px;
            }

            .notification-button {
                color: white;
                border: none;
                padding: 10px 14px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .notification-button:hover {
                transform: translateY(-2px);
                filter: brightness(1.1);
            }

            .notification-button:active {
                transform: translateY(0);
            }

            /* group container for multiple action buttons */
            .notification-button-group {
                display: flex;
                gap: 12px;
                justify-content: center;
                flex-wrap: wrap;
                margin-top: 10px;
            }

            .notification-icon-checkmark {
                animation: checkmark-draw 0.6s ease-in-out;
            }

            .notification-icon-cross {
                animation: cross-draw 0.5s ease-in-out;
            }

            @keyframes checkmark-draw {
                0% {
                    transform: scale(0) rotate(-45deg);
                    opacity: 0;
                }
                50% {
                    transform: scale(1.2) rotate(-45deg);
                }
                100% {
                    transform: scale(1) rotate(0deg);
                    opacity: 1;
                }
            }

            @keyframes cross-draw {
                0% {
                    transform: scale(0) rotate(-180deg);
                    opacity: 0;
                }
                50% {
                    transform: scale(1.2) rotate(-90deg);
                }
                100% {
                    transform: scale(1) rotate(0deg);
                    opacity: 1;
                }
            }

            /* Loading spinner styles */
            .notification-loading-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin: 0 auto;
            }

            .notification-spinner {
                width: 60px;
                height: 60px;
                border: 5px solid rgba(99, 102, 241, 0.15);
                border-top-color: #6366f1;
                border-radius: 50%;
                animation: notification-spin 1s linear infinite;
                margin: 0 auto;
            }

            @keyframes notification-spin {
                to {
                    transform: rotate(360deg);
                }
            }

            .notification-loading-text {
                font-size: 14px;
                color: #6b7280;
                text-align: center;
                margin-top: 12px;
            }

            .dark .notification-loading-text {
                color: #cbd5e1;
            }

            /* ==================== Toast ==================== */
            .notify-toast-container {
                position: fixed;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
                width: 360px;
                max-width: calc(100vw - 40px);
            }
            .notify-toast-top-right  { top: 20px; right: 20px; }
            .notify-toast-top-left   { top: 20px; left: 20px; }
            .notify-toast-top-center { top: 20px; left: 50%; transform: translateX(-50%); }
            .notify-toast-bottom-right { bottom: 20px; right: 20px; flex-direction: column-reverse; }
            .notify-toast-bottom-left  { bottom: 20px; left: 20px; flex-direction: column-reverse; }

            .notify-toast {
                background: white;
                border-radius: 12px;
                padding: 14px 40px 14px 14px;
                box-shadow: 0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06);
                display: flex;
                align-items: flex-start;
                gap: 12px;
                pointer-events: auto;
                position: relative;
                overflow: hidden;
                opacity: 0;
                transform: translateX(30px);
                transition: opacity 0.25s ease, transform 0.25s ease;
            }
            .notify-toast-top-left .notify-toast,
            .notify-toast-bottom-left .notify-toast { transform: translateX(-30px); }
            .notify-toast-top-center .notify-toast { transform: translateY(-20px); }
            .notify-toast.notify-toast-visible {
                opacity: 1;
                transform: translateX(0) translateY(0) !important;
            }

            .notify-toast-icon {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                flex-shrink: 0;
                color: white;
            }
            .notify-toast-icon.success  { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
            .notify-toast-icon.error    { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }
            .notify-toast-icon.warning  { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
            .notify-toast-icon.info     { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
            .notify-toast-icon.question { background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); }
            .notify-toast-icon.loading  { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); }

            .notify-toast-content { flex: 1; min-width: 0; }
            .notify-toast-title {
                font-size: 14px;
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 2px;
                line-height: 1.3;
                cursor: default;
            }
            .notify-toast-message {
                font-size: 13px;
                color: #6b7280;
                line-height: 1.5;
                cursor: default;
            }

            .notify-toast-close {
                position: absolute;
                top: 8px;
                right: 8px;
                width: 24px;
                height: 24px;
                border-radius: 6px;
                border: none;
                background: rgba(0,0,0,0.06);
                color: #6b7280;
                cursor: pointer;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                line-height: 1;
                padding: 0;
            }
            .notify-toast-close:hover { background: rgba(0,0,0,0.1); color: #374151; }

            /* Sin bot\xF3n de cierre: reducir padding derecho */
            .notify-toast.notify-toast-no-close { padding-right: 14px; }

            .notify-toast-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                width: 100%;
                border-radius: 0 0 0 12px;
            }
            .notify-toast-progress.success  { background: #10b981; }
            .notify-toast-progress.error    { background: #ef4444; }
            .notify-toast-progress.warning  { background: #f59e0b; }
            .notify-toast-progress.info     { background: #3b82f6; }
            .notify-toast-progress.question { background: #8b5cf6; }
            .notify-toast-progress.loading  { background: #6366f1; }

            /* Spinner para toast de carga */
            .notify-toast-spinner {
                width: 18px;
                height: 18px;
                border: 2.5px solid rgba(255,255,255,0.35);
                border-top-color: white;
                border-radius: 50%;
                animation: notification-spin 0.8s linear infinite;
                flex-shrink: 0;
            }

            .dark .notify-toast { background: #0f1724; box-shadow: 0 4px 24px rgba(0,0,0,0.35); }
            .dark .notify-toast-title   { color: #e6eef8; }
            .dark .notify-toast-message { color: #cbd5e1; }
            .dark .notify-toast-close   { background: rgba(255,255,255,0.06); color: #94a3b8; }
            .dark .notify-toast-close:hover { background: rgba(255,255,255,0.1); color: #e2e8f0; }

            /* Respeta la preferencia de movimiento reducido del sistema */
            @media (prefers-reduced-motion: reduce) {
                .notify-toast {
                    transition: opacity 0.1s ease !important;
                    transform: none !important;
                }
                .notify-toast.notify-toast-visible {
                    transform: none !important;
                }
                .notify-toast-spinner {
                    animation-duration: 1.5s !important;
                }
                .notify-toast-progress {
                    transition: none !important;
                }
            }

            /* Inline SVG icon sizing */
            .notification-icon svg {
                width: 40px;
                height: 40px;
                display: block;
            }
            .notify-toast-icon svg {
                width: 20px;
                height: 20px;
                display: block;
            }
        `,document.head.appendChild(e)}_prefersReducedMotion(){try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch{return!1}}_cssAnimate(e,t,o){var l,d,b,x;if(this._prefersReducedMotion()){t.opacity!==void 0&&(e.style.opacity=String(t.opacity)),t.transform!==void 0&&(e.style.transform=t.transform),e.style.transition="",o.complete&&setTimeout(o.complete,0);return}const E=(b=(d=T[(l=o.easing)!==null&&l!==void 0?l:"ease"])!==null&&d!==void 0?d:o.easing)!==null&&b!==void 0?b:"ease",D=()=>{requestAnimationFrame(()=>{requestAnimationFrame(()=>{const k=[];t.opacity!==void 0&&k.push(`opacity ${o.duration}ms ${E}`),t.transform!==void 0&&k.push(`transform ${o.duration}ms ${E}`),e.style.transition=k.join(", "),t.opacity!==void 0&&(e.style.opacity=String(t.opacity)),t.transform!==void 0&&(e.style.transform=t.transform),o.complete&&setTimeout(o.complete,o.duration+50)})})};((x=o.delay)!==null&&x!==void 0?x:0)>0?setTimeout(D,o.delay):D()}getIcon(e){var t;const o=d=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`,l={success:o('<polyline points="20 6 9 17 4 12"/>'),error:o('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),warning:o('<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'),info:o('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'),question:o('<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>'),loading:'<div class="notify-toast-spinner" aria-hidden="true"></div>'};return(t=l[e])!==null&&t!==void 0?t:l.info}getDefaultTitle(e){return{success:"\xA1\xC9xito!",error:"Error",warning:"Advertencia",info:"Informaci\xF3n",question:"Pregunta"}[e]||"Notificaci\xF3n"}getButtonGradient(e){const t={success:"linear-gradient(135deg, #10b981 0%, #059669 100%)",error:"linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",warning:"linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",info:"linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",question:"linear-gradient(135deg, #8b5cf6 0%, #8b5cf6 100%)"};return t[e]||t.info}getButtonShadow(e){const t={success:"rgba(16, 185, 129, 0)",error:"rgba(239, 68, 68, 0)",warning:"rgba(245, 159, 11, 0)",info:"rgba(59, 131, 246, 0)",question:"rgba(139, 92, 246, 0)"};return t[e]||t.info}show(e={}){if(this.currentNotification){const n=this.currentNotification;this.currentNotification=null;try{n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}}const{type:t="info",title:o=this.getDefaultTitle(t),message:l="",buttonText:d="OK",buttonColor:b=null,onClose:x=null,timer:E=null,allowOutsideClick:D=!0,allowEscapeKey:k=!0,hideButton:I=!1,buttons:w=null}=e,H=e.showCloseButton===!0;try{document.body.style.overflow="hidden"}catch{}try{document.documentElement.style.overflow="hidden"}catch{}const p=document.createElement("div");p.className="notification-overlay",p.tabIndex=-1,p.setAttribute("role","dialog"),p.setAttribute("aria-modal","true"),p.style.pointerEvents="auto";const i=document.createElement("div");i.className="notification-box";const h=document.createElement("div");h.className=`notification-icon ${t}`,I&&t==="info"?(h.className="notification-loading-container",h.innerHTML='<div class="notification-spinner"></div>',h.style.background="transparent",h.style.boxShadow="none",h.style.width="100px",h.style.height="100px"):h.innerHTML=this.getIcon(t);const L=document.createElement("h3");L.className="notification-title",L.textContent=o;const A=document.createElement("p");A.className="notification-message",A.textContent=l;let r=null;if(e.html||e.content)if(r=document.createElement("div"),r.className="notification-content",e.html)try{r.innerHTML=e.html}catch{r.textContent=e.html}else e.content&&e.content instanceof HTMLElement&&r.appendChild(e.content);const g=()=>this.close(x);let s=null,y=null;if(!I){if(Array.isArray(w)&&w.length)y=document.createElement("div"),y.className="notification-button-group",w.forEach(n=>{const c=document.createElement("button");c.className="notification-button",c.textContent=n.text||"OK";const m=n.color||this.getButtonGradient(t),O=n.shadowColor||this.getButtonShadow(t);c.style.background=m,c.style.boxShadow=`0 4px 12px ${O}`,c.addEventListener("click",N=>{N.stopPropagation(),N.preventDefault();try{g().then(()=>{if(typeof n.onClick=="function")try{const f=n.onClick();f&&typeof f.then=="function"&&f.catch(Q=>console.error(Q))}catch(f){console.error(f)}}).catch(()=>{})}catch(f){console.error(f)}}),c.addEventListener("mouseenter",()=>{c.style.boxShadow=`0 6px 16px ${O}`}),c.addEventListener("mouseleave",()=>{c.style.boxShadow=`0 4px 12px ${O}`}),y.appendChild(c)});else if(e.onConfirm||e.onCancel||e.confirmText||e.cancelText){y=document.createElement("div"),y.className="notification-button-group";const n=e.cancelText||"Cancelar",c=e.confirmText||"Aceptar",m=document.createElement("button");m.className="notification-button",m.textContent=n;const O=e.cancelColor||"linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)",N=e.cancelShadow||"rgba(107,114,128,0.25)";m.style.background=O,m.style.boxShadow=`0 4px 12px ${N}`,m.addEventListener("click",B=>{B.stopPropagation(),B.preventDefault(),g().then(()=>{try{if(typeof e.onCancel=="function"){const C=e.onCancel();C&&typeof C.then=="function"&&C.catch(J=>console.error(J))}}catch(C){console.error(C)}}).catch(()=>{})}),m.addEventListener("mouseenter",()=>{m.style.boxShadow=`0 6px 16px ${N}`}),m.addEventListener("mouseleave",()=>{m.style.boxShadow=`0 4px 12px ${N}`});const f=document.createElement("button");f.className="notification-button",f.textContent=c;const Q=e.confirmColor||this.getButtonGradient(t),F=e.confirmShadow||this.getButtonShadow(t);f.style.background=Q,f.style.boxShadow=`0 4px 12px ${F}`,f.addEventListener("click",async B=>{B.stopPropagation(),B.preventDefault();try{if(await g(),typeof e.onConfirm=="function"){const C=e.onConfirm();C&&typeof C.then=="function"&&await C}}catch(C){console.error(C)}}),f.addEventListener("mouseenter",()=>{f.style.boxShadow=`0 6px 16px ${F}`}),f.addEventListener("mouseleave",()=>{f.style.boxShadow=`0 4px 12px ${F}`}),y.appendChild(m),y.appendChild(f)}else if(d){s=document.createElement("button"),s.className="notification-button",s.textContent=d;const n=b||this.getButtonGradient(t),c=this.getButtonShadow(t);s.style.background=n,s.style.boxShadow=`0 4px 12px ${c}`}}let _=null;if(H&&(_=document.createElement("button"),_.setAttribute("aria-label","Cerrar"),_.className="notification-close",_.innerHTML="&times;",_.addEventListener("click",n=>{n.stopPropagation(),g()})),i.appendChild(h),r){const n="notify-desc-"+Date.now();r.id=n,p.setAttribute("aria-describedby",n),i.appendChild(r)}else i.appendChild(L),i.appendChild(A);_&&i.appendChild(_),y?i.appendChild(y):s&&i.appendChild(s),p.appendChild(i),document.body.appendChild(p);const j=p,z=new Promise(n=>{try{j._externalResolve=n}catch{}});try{const n=document.getElementById("notify-live");n&&(n.textContent=`${o}: ${l}`)}catch{}try{this._lastActiveElement=document.activeElement}catch{this._lastActiveElement=null}this.currentNotification=p;try{const n=i.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');n&&n.length?n[0].focus():s?s.focus():p.focus()}catch{try{p.focus()}catch{}}const M=n=>{if(n.key!=="Tab")return;const m=Array.from(i.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')).filter(f=>f instanceof HTMLElement&&f.offsetParent!==null);if(!m.length){n.preventDefault();return}const O=m[0],N=m[m.length-1];!n.shiftKey&&document.activeElement===N?(n.preventDefault(),O.focus()):n.shiftKey&&document.activeElement===O&&(n.preventDefault(),N.focus())};j._focusTrap=M,document.addEventListener("keydown",M);const u=e.anim||{},R=typeof u.overlayDuration=="number"?u.overlayDuration:150,a=u.overlayEasing||"easeOutQuad",q=typeof u.boxDuration=="number"?u.boxDuration:200,K=typeof u.boxDelay=="number"?u.boxDelay:50,G=u.boxEasing||"easeOutBack",X=typeof u.boxStartScale=="number"?u.boxStartScale:.8,Y=typeof u.iconDuration=="number"?u.iconDuration:250,W=typeof u.iconDelay=="number"?u.iconDelay:100,V=typeof u.iconRotate=="number"?u.iconRotate:t==="success"?-90:t==="error"?90:0;if(typeof u.overlayOpacity=="number"&&(p.style.backgroundColor=`rgba(0,0,0,${u.overlayOpacity})`),p.style.opacity="0",i.style.opacity="0",i.style.transform=`scale(${X})`,h.style.opacity="0",h.style.transform=`scale(0) rotate(${V}deg)`,this._cssAnimate(p,{opacity:1},{duration:R,easing:a}),this._cssAnimate(i,{opacity:1,transform:"scale(1)"},{duration:q,easing:G,delay:K}),this._cssAnimate(h,{opacity:1,transform:"scale(1) rotate(0deg)"},{duration:Y,easing:G,delay:W}),s){const n=this.getButtonShadow(t);s.addEventListener("mouseenter",()=>{s.style.boxShadow=`0 6px 16px ${n}`}),s.addEventListener("mouseleave",()=>{s.style.boxShadow=`0 4px 12px ${n}`}),s.addEventListener("click",c=>{c.stopPropagation(),c.preventDefault(),g().catch(()=>{})})}if(D&&p.addEventListener("click",n=>{i.contains(n.target)||g()}),E&&setTimeout(()=>{g()},E),k){const n=c=>{c.key==="Escape"&&(g(),document.removeEventListener("keydown",n))};j._escHandler=n,document.addEventListener("keydown",n)}return z}close(e=null){if(!this.currentNotification)return Promise.resolve();const t=this.currentNotification,o=t,l=t.querySelector(".notification-box");return this.currentNotification=null,l instanceof HTMLElement&&this._cssAnimate(l,{opacity:0,transform:"scale(0.8)"},{duration:100,easing:"easeInQuad"}),new Promise(d=>{this._cssAnimate(t,{opacity:0},{duration:100,easing:"easeInQuad",complete:()=>{try{o&&o._escHandler&&(document.removeEventListener("keydown",o._escHandler),o._escHandler=void 0)}catch{}try{o&&o._focusTrap&&(document.removeEventListener("keydown",o._focusTrap),o._focusTrap=void 0)}catch{}try{if(o&&typeof o._externalResolve=="function"){try{o._externalResolve()}catch{}o._externalResolve=void 0}}catch{}try{t&&t.parentNode&&t.parentNode.removeChild(t)}catch{try{t.remove()}catch{}}if(!this.currentNotification){try{document.body.style.overflow=""}catch{}try{document.documentElement.style.overflow=""}catch{}}try{this._lastActiveElement&&typeof this._lastActiveElement.focus=="function"&&this._lastActiveElement.focus()}catch{}this._lastActiveElement=null,e&&e(),d()}})})}success(e,t=null,o={}){this.show(Object.assign({type:"success",title:t||this.getDefaultTitle("success"),message:e},o))}error(e,t=null,o={}){this.show(Object.assign({type:"error",title:t||this.getDefaultTitle("error"),message:e},o))}warning(e,t=null,o={}){this.show(Object.assign({type:"warning",title:t||this.getDefaultTitle("warning"),message:e},o))}question(e,t=null,o={}){this.show(Object.assign({type:"question",title:t||this.getDefaultTitle("question"),message:e},o))}info(e,t=null,o={}){this.show(Object.assign({type:"info",title:t||this.getDefaultTitle("info"),message:e},o))}loading(e="Cargando...",t="Espera",o={}){const l=Object.assign({type:"info",title:t,message:e,hideButton:!0,allowOutsideClick:!1,allowEscapeKey:!1},o),d=this.show(l);return this._currentLoadingPromise=d,d}closeLoading(e=null){return this._currentLoadingPromise=null,this.close(e)}hide(e=null){return this.close(e)}hiden(e=null){return this.close(e)}_formatTime(e){const t=Math.max(0,Math.floor(e)),o=Math.floor(t/60).toString().padStart(2,"0"),l=(t%60).toString().padStart(2,"0");return`${o}:${l}`}showToast(e,t={}){var o,l;const d=t.type||"info",b=(o=t.title)!==null&&o!==void 0?o:null,x=typeof t.duration=="number"?t.duration:4e3,E=t.position||"top-right",D=t.showProgress!==!1,k=(l=t.id)!==null&&l!==void 0?l:null,I=t.closeable!==!1;if(k!==null){const a=this._toastInstances.get(k);if(a){a.reset(x);return}}let w=this._toastContainers.get(E);(!w||!document.body.contains(w))&&(w=document.createElement("div"),w.className=`notify-toast-container notify-toast-${E}`,w.setAttribute("aria-label","Notificaciones"),document.body.appendChild(w),this._toastContainers.set(E,w));const H=E.startsWith("bottom"),p=E==="top-center",i=document.createElement("div");i.className="notify-toast",I||i.classList.add("notify-toast-no-close"),d==="error"||d==="warning"?i.setAttribute("role","alert"):i.setAttribute("role","status"),i.setAttribute("aria-atomic","true"),i.setAttribute("aria-live",d==="error"||d==="warning"?"assertive":"polite");const h=document.createElement("div");h.className=`notify-toast-icon ${d}`,h.innerHTML=this.getIcon(d);const L=document.createElement("div");if(L.className="notify-toast-content",b){const a=document.createElement("div");a.className="notify-toast-title",a.textContent=b,L.appendChild(a)}const A=document.createElement("div");if(A.className="notify-toast-message",A.textContent=e,L.appendChild(A),i.appendChild(h),i.appendChild(L),I){const a=document.createElement("button");a.className="notify-toast-close",a.setAttribute("aria-label","Cerrar notificaci\xF3n"),a.innerHTML="&times;",a.addEventListener("click",j),i.appendChild(a)}let r=null;x>0&&D&&(r=document.createElement("div"),r.className=`notify-toast-progress ${d}`,r.setAttribute("role","progressbar"),r.setAttribute("aria-hidden","true"),i.appendChild(r)),H||p?w.appendChild(i):w.insertBefore(i,w.firstChild);let g=!1,s=null,y=x,_=0;function j(){if(g)return Promise.resolve();if(g=!0,i.contains(document.activeElement))try{document.activeElement.blur()}catch{}return i.classList.remove("notify-toast-visible"),new Promise(a=>{setTimeout(()=>{i.parentNode&&i.parentNode.removeChild(i),a()},300)})}const z=a=>{_=Date.now(),s=setTimeout(()=>{k!==null&&this._toastInstances.delete(k),j()},a),r&&(r.style.transition=`width ${a}ms linear`,r.style.width="0%")},M=()=>{if(g||s===null)return;clearTimeout(s),s=null;const a=Date.now()-_;if(y=Math.max(0,y-a),r){const q=y/x*100;r.style.transition="none",r.style.width=`${q}%`}},u=()=>{g||y<=0||z(y)},R=a=>{g||(s!==null&&(clearTimeout(s),s=null),y=a,a>0?(r&&(r.style.transition="none",r.style.width="100%",r.offsetWidth),z(a)):r&&(r.style.transition="none",r.style.width="100%"))};if(k!==null){const a=()=>{if(!g){if(g=!0,s!==null&&clearTimeout(s),i.contains(document.activeElement))try{document.activeElement.blur()}catch{}i.parentNode&&i.parentNode.removeChild(i)}};this._toastInstances.set(k,{reset:R,dismiss:j,_silentDismiss:a})}requestAnimationFrame(()=>{requestAnimationFrame(()=>{i.classList.add("notify-toast-visible"),x>0&&z(x)})}),x>0&&I&&(i.addEventListener("mouseenter",M),i.addEventListener("mouseleave",u))}toast(e,t={}){if(typeof e=="string")this.showToast(e,t);else{const{message:o=""}=e,l=__rest(e,["message"]);this.showToast(o,l)}}toastSuccess(e,t,o={}){this.showToast(e,Object.assign(Object.assign({},o),{type:"success",title:t??o.title}))}toastError(e,t,o={}){this.showToast(e,Object.assign(Object.assign({},o),{type:"error",title:t??o.title}))}toastWarning(e,t,o={}){this.showToast(e,Object.assign(Object.assign({},o),{type:"warning",title:t??o.title}))}toastInfo(e,t,o={}){this.showToast(e,Object.assign(Object.assign({},o),{type:"info",title:t??o.title}))}toastQuestion(e,t,o={}){this.showToast(e,Object.assign(Object.assign({},o),{type:"question",title:t??o.title}))}toastLoading(e="Cargando...",t,o={}){this.showToast(e,Object.assign(Object.assign({position:"top-right"},o),{type:"loading",title:t??o.title,id:"__loading__",closeable:!1,duration:0,showProgress:!1}))}closeToastLoading(){const e=this._toastInstances.get("__loading__");return e?(this._toastInstances.delete("__loading__"),e.dismiss()):Promise.resolve()}replaceToastLoading(e,t={}){const o=this._toastInstances.get("__loading__");o&&(this._toastInstances.delete("__loading__"),o._silentDismiss()),this.showToast(e,t)}}const v=new $,S=window;S.notify=v,S.Notification=v}P()})();
