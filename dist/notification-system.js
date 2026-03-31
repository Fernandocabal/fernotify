"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
(function ensureAnimeDependency() {
    if (typeof anime !== 'undefined') {
        initFerNotify();
    }
    else {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
        script.onload = initFerNotify;
        script.onerror = () => {
            console.error('FerNotify: No se pudo cargar anime.js. Por favor, cargalo manualmente.');
        };
        document.head.appendChild(script);
    }
    function initFerNotify() {
        class NotificationSystem {
            constructor() {
                this.currentNotification = null;
                this._lastActiveElement = null;
                this._currentLoadingPromise = null;
                this._toastContainers = new Map();
                this.injectStyles();
                this.loadBoxicons();
            }
            loadBoxicons() {
                if (!document.querySelector('link[href*="boxicons"]')) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css';
                    document.head.appendChild(link);
                }
            }
            injectStyles() {
                const style = document.createElement('style');
                style.textContent = `
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
            /* Esto tiene prioridad sobre prefers-color-scheme para respetar la elección del usuario en la web */
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

            .notify-toast-content { flex: 1; min-width: 0; }
            .notify-toast-title {
                font-size: 14px;
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 2px;
                line-height: 1.3;
            }
            .notify-toast-message {
                font-size: 13px;
                color: #6b7280;
                line-height: 1.5;
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

            .dark .notify-toast { background: #0f1724; box-shadow: 0 4px 24px rgba(0,0,0,0.35); }
            .dark .notify-toast-title   { color: #e6eef8; }
            .dark .notify-toast-message { color: #cbd5e1; }
            .dark .notify-toast-close   { background: rgba(255,255,255,0.06); color: #94a3b8; }
            .dark .notify-toast-close:hover { background: rgba(255,255,255,0.1); color: #e2e8f0; }
        `;
                document.head.appendChild(style);
            }
            getIcon(type) {
                const icons = {
                    'success': '<i class="bx bx-check" aria-hidden="true"></i>',
                    'error': '<i class="bx bx-x" aria-hidden="true"></i>',
                    'warning': '<i class="bx bx-error" aria-hidden="true"></i>',
                    'info': '<i class="bx bx-info-circle" aria-hidden="true"></i>',
                    'question': '<i class="bx bx-question-mark" aria-hidden="true"></i>'
                };
                return icons[type] || icons.info;
            }
            getDefaultTitle(type) {
                const titles = {
                    'success': '¡Éxito!',
                    'error': 'Error',
                    'warning': 'Advertencia',
                    'info': 'Información',
                    'question': 'Pregunta'
                };
                return titles[type] || 'Notificación';
            }
            getButtonGradient(type) {
                const gradients = {
                    'success': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    'error': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    'warning': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    'info': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    'question': 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)'
                };
                return gradients[type] || gradients.info;
            }
            getButtonShadow(type) {
                const shadows = {
                    'success': 'rgba(16, 185, 129, 0)',
                    'error': 'rgba(239, 68, 68, 0)',
                    'warning': 'rgba(245, 159, 11, 0)',
                    'info': 'rgba(59, 131, 246, 0)',
                    'question': 'rgba(108, 99, 245, 0)'
                };
                return shadows[type] || shadows.info;
            }
            show(options = {}) {
                // Cerrar notificación existente si hay (esperar a que termine)
                if (this.currentNotification) {
                    const oldOverlay = this.currentNotification;
                    this.currentNotification = null;
                    try {
                        if (oldOverlay && oldOverlay.parentNode) {
                            oldOverlay.parentNode.removeChild(oldOverlay);
                        }
                    }
                    catch (e) { }
                }
                const { type = 'info', title = this.getDefaultTitle(type), message = '', buttonText = 'OK', buttonColor = null, onClose = null, timer = null, allowOutsideClick = true, allowEscapeKey = true, hideButton = false, buttons = null } = options;
                const showCloseButton = options.showCloseButton === true;
                try {
                    document.body.style.overflow = 'hidden';
                }
                catch (e) { }
                try {
                    document.documentElement.style.overflow = 'hidden';
                }
                catch (e) { }
                const overlay = document.createElement('div');
                overlay.className = 'notification-overlay';
                overlay.tabIndex = -1;
                overlay.setAttribute('role', 'dialog');
                overlay.setAttribute('aria-modal', 'true');
                overlay.style.pointerEvents = 'auto';
                const box = document.createElement('div');
                box.className = 'notification-box';
                const icon = document.createElement('div');
                icon.className = `notification-icon ${type}`;
                if (hideButton && type === 'info') {
                    icon.className = 'notification-loading-container';
                    icon.innerHTML = '<div class="notification-spinner"></div>';
                    icon.style.background = 'transparent';
                    icon.style.boxShadow = 'none';
                    icon.style.width = '100px';
                    icon.style.height = '100px';
                }
                else {
                    icon.innerHTML = this.getIcon(type);
                }
                const titleElement = document.createElement('h3');
                titleElement.className = 'notification-title';
                titleElement.textContent = title;
                const messageElement = document.createElement('p');
                messageElement.className = 'notification-message';
                messageElement.textContent = message;
                let customContent = null;
                if (options.html || options.content) {
                    customContent = document.createElement('div');
                    customContent.className = 'notification-content';
                    if (options.html) {
                        try {
                            customContent.innerHTML = options.html;
                        }
                        catch (e) {
                            customContent.textContent = options.html;
                        }
                    }
                    else if (options.content && options.content instanceof HTMLElement) {
                        customContent.appendChild(options.content);
                    }
                }
                const closeHandler = () => {
                    return this.close(onClose);
                };
                let button = null;
                let buttonContainer = null;
                if (!hideButton) {
                    if (Array.isArray(buttons) && buttons.length) {
                        buttonContainer = document.createElement('div');
                        buttonContainer.className = 'notification-button-group';
                        buttons.forEach((btn) => {
                            const btnEl = document.createElement('button');
                            btnEl.className = 'notification-button';
                            btnEl.textContent = btn.text || 'OK';
                            const finalBtnColor = btn.color || this.getButtonGradient(type);
                            const btnShadow = btn.shadowColor || this.getButtonShadow(type);
                            btnEl.style.background = finalBtnColor;
                            btnEl.style.boxShadow = `0 4px 12px ${btnShadow}`;
                            btnEl.addEventListener('click', (e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                try {
                                    closeHandler().then(() => {
                                        if (typeof btn.onClick === 'function') {
                                            try {
                                                const res = btn.onClick();
                                                if (res && typeof res.then === 'function') {
                                                    res.catch((err) => console.error(err));
                                                }
                                            }
                                            catch (err) {
                                                console.error(err);
                                            }
                                        }
                                    }).catch(() => { });
                                }
                                catch (err) {
                                    console.error(err);
                                }
                            });
                            btnEl.addEventListener('mouseenter', () => {
                                btnEl.style.boxShadow = `0 6px 16px ${btnShadow}`;
                            });
                            btnEl.addEventListener('mouseleave', () => {
                                btnEl.style.boxShadow = `0 4px 12px ${btnShadow}`;
                            });
                            buttonContainer.appendChild(btnEl);
                        });
                    }
                    else if (options.onConfirm || options.onCancel || options.confirmText || options.cancelText) {
                        buttonContainer = document.createElement('div');
                        buttonContainer.className = 'notification-button-group';
                        const cancelText = options.cancelText || 'Cancelar';
                        const confirmText = options.confirmText || 'Aceptar';
                        const cancelBtn = document.createElement('button');
                        cancelBtn.className = 'notification-button';
                        cancelBtn.textContent = cancelText;
                        const cancelColor = options.cancelColor || 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)';
                        const cancelShadow = options.cancelShadow || 'rgba(107,114,128,0.25)';
                        cancelBtn.style.background = cancelColor;
                        cancelBtn.style.boxShadow = `0 4px 12px ${cancelShadow}`;
                        cancelBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            closeHandler().then(() => {
                                try {
                                    if (typeof options.onCancel === 'function') {
                                        const res = options.onCancel();
                                        if (res && typeof res.then === 'function') {
                                            res.catch((err) => console.error(err));
                                        }
                                    }
                                }
                                catch (err) {
                                    console.error(err);
                                }
                            }).catch(() => { });
                        });
                        cancelBtn.addEventListener('mouseenter', () => { cancelBtn.style.boxShadow = `0 6px 16px ${cancelShadow}`; });
                        cancelBtn.addEventListener('mouseleave', () => { cancelBtn.style.boxShadow = `0 4px 12px ${cancelShadow}`; });
                        const confirmBtn = document.createElement('button');
                        confirmBtn.className = 'notification-button';
                        confirmBtn.textContent = confirmText;
                        const confirmColor = options.confirmColor || this.getButtonGradient(type);
                        const confirmShadow = options.confirmShadow || this.getButtonShadow(type);
                        confirmBtn.style.background = confirmColor;
                        confirmBtn.style.boxShadow = `0 4px 12px ${confirmShadow}`;
                        confirmBtn.addEventListener('click', async (e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            try {
                                await closeHandler();
                                if (typeof options.onConfirm === 'function') {
                                    const res = options.onConfirm();
                                    if (res && typeof res.then === 'function') {
                                        await res;
                                    }
                                }
                            }
                            catch (err) {
                                console.error(err);
                            }
                        });
                        confirmBtn.addEventListener('mouseenter', () => { confirmBtn.style.boxShadow = `0 6px 16px ${confirmShadow}`; });
                        confirmBtn.addEventListener('mouseleave', () => { confirmBtn.style.boxShadow = `0 4px 12px ${confirmShadow}`; });
                        buttonContainer.appendChild(cancelBtn);
                        buttonContainer.appendChild(confirmBtn);
                    }
                    else if (buttonText) {
                        button = document.createElement('button');
                        button.className = 'notification-button';
                        button.textContent = buttonText;
                        const finalButtonColor = buttonColor || this.getButtonGradient(type);
                        const buttonShadowColor = this.getButtonShadow(type);
                        button.style.background = finalButtonColor;
                        button.style.boxShadow = `0 4px 12px ${buttonShadowColor}`;
                    }
                }
                let closeBtn = null;
                if (showCloseButton) {
                    closeBtn = document.createElement('button');
                    closeBtn.setAttribute('aria-label', 'Cerrar');
                    closeBtn.className = 'notification-close';
                    closeBtn.innerHTML = '&times;';
                    closeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        closeHandler();
                    });
                }
                box.appendChild(icon);
                if (customContent) {
                    const descId = 'notify-desc-' + Date.now();
                    customContent.id = descId;
                    overlay.setAttribute('aria-describedby', descId);
                    box.appendChild(customContent);
                }
                else {
                    box.appendChild(titleElement);
                    box.appendChild(messageElement);
                }
                if (closeBtn)
                    box.appendChild(closeBtn);
                if (buttonContainer) {
                    box.appendChild(buttonContainer);
                }
                else if (button) {
                    box.appendChild(button);
                }
                overlay.appendChild(box);
                document.body.appendChild(overlay);
                const overlayMeta = overlay;
                const closePromise = new Promise((resolveClose) => {
                    try {
                        overlayMeta._externalResolve = resolveClose;
                    }
                    catch (e) { }
                });
                try {
                    const live = document.getElementById('notify-live');
                    if (live) {
                        live.textContent = `${title}: ${message}`;
                    }
                }
                catch (e) { }
                try {
                    this._lastActiveElement = document.activeElement;
                }
                catch (e) {
                    this._lastActiveElement = null;
                }
                this.currentNotification = overlay;
                try {
                    const focusable = box.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
                    if (focusable && focusable.length) {
                        focusable[0].focus();
                    }
                    else if (button) {
                        button.focus();
                    }
                    else {
                        overlay.focus();
                    }
                }
                catch (e) {
                    try {
                        overlay.focus();
                    }
                    catch (err) { }
                }
                const focusTrap = (e) => {
                    if (e.key !== 'Tab')
                        return;
                    const focusableNodes = Array.from(box.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'));
                    const focusable = focusableNodes.filter((el) => el instanceof HTMLElement && el.offsetParent !== null);
                    if (!focusable.length) {
                        e.preventDefault();
                        return;
                    }
                    const first = focusable[0];
                    const last = focusable[focusable.length - 1];
                    if (!e.shiftKey && document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                    else if (e.shiftKey && document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    }
                };
                overlayMeta._focusTrap = focusTrap;
                document.addEventListener('keydown', focusTrap);
                const anim = options.anim || {};
                const overlayDuration = typeof anim.overlayDuration === 'number' ? anim.overlayDuration : 150;
                const overlayEasing = anim.overlayEasing || 'easeOutQuad';
                const boxDuration = typeof anim.boxDuration === 'number' ? anim.boxDuration : 200;
                const boxDelay = typeof anim.boxDelay === 'number' ? anim.boxDelay : 50;
                const boxEasing = anim.boxEasing || 'easeOutBack';
                const boxStartScale = typeof anim.boxStartScale === 'number' ? anim.boxStartScale : 0.8;
                const iconDuration = typeof anim.iconDuration === 'number' ? anim.iconDuration : 250;
                const iconDelay = typeof anim.iconDelay === 'number' ? anim.iconDelay : 100;
                const iconRotate = (typeof anim.iconRotate === 'number') ? anim.iconRotate : (type === 'success' ? -90 : type === 'error' ? 90 : 0);
                if (typeof anim.overlayOpacity === 'number') {
                    overlay.style.backgroundColor = `rgba(0,0,0,${anim.overlayOpacity})`;
                }
                anime({
                    targets: overlay,
                    opacity: [0, 1],
                    duration: overlayDuration,
                    easing: overlayEasing
                });
                anime({
                    targets: box,
                    scale: [boxStartScale, 1],
                    opacity: [0, 1],
                    duration: boxDuration,
                    easing: boxEasing,
                    delay: boxDelay
                });
                anime({
                    targets: icon,
                    scale: [0, 1],
                    rotate: [iconRotate, 0],
                    duration: iconDuration,
                    easing: boxEasing,
                    delay: iconDelay
                });
                if (button) {
                    const buttonShadowColor = this.getButtonShadow(type);
                    button.addEventListener('mouseenter', () => {
                        button.style.boxShadow = `0 6px 16px ${buttonShadowColor}`;
                    });
                    button.addEventListener('mouseleave', () => {
                        button.style.boxShadow = `0 4px 12px ${buttonShadowColor}`;
                    });
                    button.addEventListener('click', (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        closeHandler().catch(() => { });
                    });
                }
                if (allowOutsideClick) {
                    overlay.addEventListener('click', (e) => {
                        if (!box.contains(e.target)) {
                            closeHandler();
                        }
                    });
                }
                if (timer) {
                    setTimeout(() => {
                        closeHandler();
                    }, timer);
                }
                if (allowEscapeKey) {
                    const escHandler = (e) => {
                        if (e.key === 'Escape') {
                            closeHandler();
                            document.removeEventListener('keydown', escHandler);
                        }
                    };
                    overlayMeta._escHandler = escHandler;
                    document.addEventListener('keydown', escHandler);
                }
                return closePromise;
            }
            close(callback = null) {
                if (!this.currentNotification) {
                    return Promise.resolve();
                }
                const overlay = this.currentNotification;
                const overlayMeta = overlay;
                const box = overlay.querySelector('.notification-box');
                this.currentNotification = null;
                anime({
                    targets: box,
                    scale: 0.8,
                    opacity: 0,
                    duration: 100,
                    easing: 'easeInQuad'
                });
                return new Promise((resolve) => {
                    anime({
                        targets: overlay,
                        opacity: 0,
                        duration: 100,
                        easing: 'easeInQuad',
                        complete: () => {
                            try {
                                if (overlayMeta && overlayMeta._escHandler) {
                                    document.removeEventListener('keydown', overlayMeta._escHandler);
                                    overlayMeta._escHandler = undefined;
                                }
                            }
                            catch (e) { }
                            try {
                                if (overlayMeta && overlayMeta._focusTrap) {
                                    document.removeEventListener('keydown', overlayMeta._focusTrap);
                                    overlayMeta._focusTrap = undefined;
                                }
                            }
                            catch (e) { }
                            try {
                                if (overlayMeta && typeof overlayMeta._externalResolve === 'function') {
                                    try {
                                        overlayMeta._externalResolve();
                                    }
                                    catch (er) { }
                                    overlayMeta._externalResolve = undefined;
                                }
                            }
                            catch (e) { }
                            try {
                                if (overlay && overlay.parentNode) {
                                    overlay.parentNode.removeChild(overlay);
                                }
                            }
                            catch (e) {
                                try {
                                    overlay.remove();
                                }
                                catch (er) { }
                            }
                            if (!this.currentNotification) {
                                try {
                                    document.body.style.overflow = '';
                                }
                                catch (e) { }
                                try {
                                    document.documentElement.style.overflow = '';
                                }
                                catch (e) { }
                            }
                            try {
                                if (this._lastActiveElement && typeof this._lastActiveElement.focus === 'function') {
                                    this._lastActiveElement.focus();
                                }
                            }
                            catch (e) { }
                            this._lastActiveElement = null;
                            if (callback)
                                callback();
                            resolve();
                        }
                    });
                });
            }
            success(message, title = null, options = {}) {
                this.show(Object.assign({ type: 'success', title: title || this.getDefaultTitle('success'), message }, options));
            }
            error(message, title = null, options = {}) {
                this.show(Object.assign({ type: 'error', title: title || this.getDefaultTitle('error'), message }, options));
            }
            warning(message, title = null, options = {}) {
                this.show(Object.assign({ type: 'warning', title: title || this.getDefaultTitle('warning'), message }, options));
            }
            question(message, title = null, options = {}) {
                this.show(Object.assign({ type: 'question', title: title || this.getDefaultTitle('question'), message }, options));
            }
            info(message, title = null, options = {}) {
                this.show(Object.assign({ type: 'info', title: title || this.getDefaultTitle('info'), message }, options));
            }
            loading(message = 'Cargando...', title = 'Espera', options = {}) {
                const loadingOptions = Object.assign({ type: 'info', title,
                    message, hideButton: true, allowOutsideClick: false, allowEscapeKey: false }, options);
                const loadingPromise = this.show(loadingOptions);
                this._currentLoadingPromise = loadingPromise;
                return loadingPromise;
            }
            closeLoading(callback = null) {
                this._currentLoadingPromise = null;
                return this.close(callback);
            }
            hide(callback = null) { return this.close(callback); }
            hiden(callback = null) { return this.close(callback); }
            _formatTime(seconds) {
                const s = Math.max(0, Math.floor(seconds));
                const mm = Math.floor(s / 60).toString().padStart(2, '0');
                const ss = (s % 60).toString().padStart(2, '0');
                return `${mm}:${ss}`;
            }
            showToast(message, options = {}) {
                var _a;
                const type = options.type || 'info';
                const title = (_a = options.title) !== null && _a !== void 0 ? _a : null;
                const duration = typeof options.duration === 'number' ? options.duration : 4000;
                const position = options.position || 'top-right';
                const showProgress = options.showProgress !== false;
                let container = this._toastContainers.get(position);
                if (!container || !document.body.contains(container)) {
                    container = document.createElement('div');
                    container.className = `notify-toast-container notify-toast-${position}`;
                    document.body.appendChild(container);
                    this._toastContainers.set(position, container);
                }
                const isBottom = position.startsWith('bottom');
                const isCenter = position === 'top-center';
                const toast = document.createElement('div');
                toast.className = 'notify-toast';
                const iconEl = document.createElement('div');
                iconEl.className = `notify-toast-icon ${type}`;
                iconEl.innerHTML = this.getIcon(type);
                const contentEl = document.createElement('div');
                contentEl.className = 'notify-toast-content';
                if (title) {
                    const titleEl = document.createElement('div');
                    titleEl.className = 'notify-toast-title';
                    titleEl.textContent = title;
                    contentEl.appendChild(titleEl);
                }
                const msgEl = document.createElement('div');
                msgEl.className = 'notify-toast-message';
                msgEl.textContent = message;
                contentEl.appendChild(msgEl);
                const closeBtn = document.createElement('button');
                closeBtn.className = 'notify-toast-close';
                closeBtn.setAttribute('aria-label', 'Cerrar notificación');
                closeBtn.innerHTML = '&times;';
                toast.appendChild(iconEl);
                toast.appendChild(contentEl);
                toast.appendChild(closeBtn);
                let progressEl = null;
                if (duration > 0 && showProgress) {
                    progressEl = document.createElement('div');
                    progressEl.className = `notify-toast-progress ${type}`;
                    toast.appendChild(progressEl);
                }
                if (isBottom || isCenter) {
                    container.appendChild(toast);
                }
                else {
                    container.insertBefore(toast, container.firstChild);
                }
                let dismissed = false;
                let timerId = null;
                let remaining = duration;
                let timerStartedAt = 0;
                const removeToast = () => {
                    if (dismissed)
                        return;
                    dismissed = true;
                    toast.classList.remove('notify-toast-visible');
                    setTimeout(() => {
                        if (toast.parentNode)
                            toast.parentNode.removeChild(toast);
                    }, 300);
                };
                const startCountdown = (ms) => {
                    timerStartedAt = Date.now();
                    timerId = setTimeout(removeToast, ms);
                    if (progressEl) {
                        progressEl.style.transition = `width ${ms}ms linear`;
                        progressEl.style.width = '0%';
                    }
                };
                const pauseCountdown = () => {
                    if (dismissed || timerId === null)
                        return;
                    clearTimeout(timerId);
                    timerId = null;
                    const elapsed = Date.now() - timerStartedAt;
                    remaining = Math.max(0, remaining - elapsed);
                    if (progressEl) {
                        const pct = (remaining / duration) * 100;
                        progressEl.style.transition = 'none';
                        progressEl.style.width = `${pct}%`;
                    }
                };
                const resumeCountdown = () => {
                    if (dismissed || remaining <= 0)
                        return;
                    startCountdown(remaining);
                };
                closeBtn.addEventListener('click', removeToast);
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        toast.classList.add('notify-toast-visible');
                        if (duration > 0) {
                            startCountdown(duration);
                        }
                    });
                });
                if (duration > 0) {
                    toast.addEventListener('mouseenter', pauseCountdown);
                    toast.addEventListener('mouseleave', resumeCountdown);
                }
            }
            toast(messageOrOptions, options = {}) {
                if (typeof messageOrOptions === 'string') {
                    this.showToast(messageOrOptions, options);
                }
                else {
                    const { message = '' } = messageOrOptions, rest = __rest(messageOrOptions, ["message"]);
                    this.showToast(message, rest);
                }
            }
            toastSuccess(message, title, options = {}) {
                this.showToast(message, Object.assign(Object.assign({}, options), { type: 'success', title: title !== null && title !== void 0 ? title : options.title }));
            }
            toastError(message, title, options = {}) {
                this.showToast(message, Object.assign(Object.assign({}, options), { type: 'error', title: title !== null && title !== void 0 ? title : options.title }));
            }
            toastWarning(message, title, options = {}) {
                this.showToast(message, Object.assign(Object.assign({}, options), { type: 'warning', title: title !== null && title !== void 0 ? title : options.title }));
            }
            toastInfo(message, title, options = {}) {
                this.showToast(message, Object.assign(Object.assign({}, options), { type: 'info', title: title !== null && title !== void 0 ? title : options.title }));
            }
            toastQuestion(message, title, options = {}) {
                this.showToast(message, Object.assign(Object.assign({}, options), { type: 'question', title: title !== null && title !== void 0 ? title : options.title }));
            }
        }
        const notifyInstance = new NotificationSystem();
        const w = window;
        w.notify = notifyInstance;
        w.Notification = notifyInstance;
    }
})();
//# sourceMappingURL=notification-system.js.map