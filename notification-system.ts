type NotifyType = 'success' | 'error' | 'warning' | 'info' | 'question' | string;

interface ButtonOptions {
    text?: string;
    color?: string;
    shadowColor?: string;
    onClick?: (() => void) | (() => Promise<unknown>);
}

interface AnimationOptions {
    overlayDuration?: number;
    overlayEasing?: string;
    boxDuration?: number;
    boxDelay?: number;
    boxEasing?: string;
    boxStartScale?: number;
    iconDuration?: number;
    iconDelay?: number;
    iconRotate?: number;
    overlayOpacity?: number;
}

interface NotificationOptions {
    type?: NotifyType;
    title?: string;
    message?: string;
    html?: string;
    content?: HTMLElement;
    buttonText?: string;
    buttonColor?: string;
    onClose?: (() => void) | null;
    timer?: number | null;
    allowOutsideClick?: boolean;
    allowEscapeKey?: boolean;
    hideButton?: boolean;
    buttons?: ButtonOptions[] | null;
    onConfirm?: (() => void) | (() => Promise<unknown>) | null;
    onCancel?: (() => void) | (() => Promise<unknown>) | null;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: string;
    confirmShadow?: string;
    cancelColor?: string;
    cancelShadow?: string;
    anim?: AnimationOptions;
    showCloseButton?: boolean;
}

interface OverlayMeta {
    _externalResolve?: () => void;
    _focusTrap?: (e: KeyboardEvent) => void;
    _escHandler?: (e: KeyboardEvent) => void;
}

interface ToastOptions {
    type?: NotifyType;
    title?: string;
    message?: string;
    duration?: number;
    position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left';
    showProgress?: boolean;
    /** ID único para deduplicación: si ya existe un toast con el mismo id, se resetea su cuenta regresiva en vez de crear uno nuevo */
    id?: string;
    /** Si es false, el botón de cierre no se muestra (útil para toasts de carga). Default: true */
    closeable?: boolean;
    /** Si es false, deshabilita el gesto de deslizar para cerrar. Default: true */
    swipeToDismiss?: boolean;
}

interface GlobalDefaults {
    toast?: Partial<ToastOptions>;
    modal?: Partial<NotificationOptions>;
}

interface ToastInstance {
    reset: (newDuration: number) => void;
    dismiss: () => Promise<void>;
    _silentDismiss: () => void;
}

(function () {
    'use strict';

    /** anime.js easing name → CSS cubic-bezier equivalents (unknown names pass through as raw CSS values) */
    const EASING: Record<string, string> = {
        easeOutQuad:     'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        easeOutCubic:    'cubic-bezier(0.215, 0.61, 0.355, 1)',
        easeOutQuart:    'cubic-bezier(0.165, 0.84, 0.44, 1)',
        easeOutQuint:    'cubic-bezier(0.23, 1, 0.32, 1)',
        easeOutBack:     'cubic-bezier(0.34, 1.56, 0.64, 1)',
        easeOutCirc:     'cubic-bezier(0.075, 0.82, 0.165, 1)',
        easeInQuad:      'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
        easeInCubic:     'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
        easeInBack:      'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
        easeInOutQuad:   'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
        easeInOutCubic:  'cubic-bezier(0.645, 0.045, 0.355, 1)',
        easeInOutBack:   'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        linear:          'linear',
        ease:            'ease',
        'ease-in':       'ease-in',
        'ease-out':      'ease-out',
        'ease-in-out':   'ease-in-out',
    };

    function initFerNotify() {
        class NotificationSystem {
            currentNotification: HTMLDivElement | null;
            _lastActiveElement: HTMLElement | null;
            _currentLoadingPromise: Promise<void> | null;
            _toastContainers: Map<string, HTMLDivElement>;
            _toastInstances: Map<string, ToastInstance>;
            _globalDefaults: Required<GlobalDefaults>;

            constructor() {
                this.currentNotification = null;
                this._lastActiveElement = null;
                this._currentLoadingPromise = null;
                this._toastContainers = new Map();
                this._toastInstances = new Map();
                this._globalDefaults = { toast: {}, modal: {} };
                this.injectStyles();
            }

            configure(defaults: GlobalDefaults): this {
                if (defaults.toast) Object.assign(this._globalDefaults.toast, defaults.toast);
                if (defaults.modal) Object.assign(this._globalDefaults.modal, defaults.modal);
                return this;
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

            /* Sin botón de cierre: reducir padding derecho */
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

            /* Swipe-to-dismiss */
            .notify-toast { touch-action: none; }
            .notify-toast-swiping { transition: none !important; cursor: grabbing; user-select: none; }

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
        `;
                document.head.appendChild(style);
            }

            private _prefersReducedMotion(): boolean {
                try {
                    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                } catch (_e) {
                    return false;
                }
            }

            /** Lightweight CSS transition helper — replaces anime.js with zero external dependency */
            private _cssAnimate(
                el: HTMLElement,
                to: Partial<{ opacity: number; transform: string }>,
                opts: { duration: number; easing?: string; delay?: number; complete?: () => void }
            ): void {
                if (this._prefersReducedMotion()) {
                    if (to.opacity !== undefined) el.style.opacity = String(to.opacity);
                    if (to.transform !== undefined) el.style.transform = to.transform;
                    el.style.transition = '';
                    if (opts.complete) setTimeout(opts.complete, 0);
                    return;
                }
                // Map legacy anime.js easing names → CSS; unknown values pass through as raw CSS
                const cssEasing = EASING[opts.easing ?? 'ease'] ?? opts.easing ?? 'ease';
                const run = () => {
                    // Double-rAF: ensures initial styles are committed before transition starts (critical in Safari)
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            const props: string[] = [];
                            if (to.opacity !== undefined) props.push(`opacity ${opts.duration}ms ${cssEasing}`);
                            if (to.transform !== undefined) props.push(`transform ${opts.duration}ms ${cssEasing}`);
                            el.style.transition = props.join(', ');
                            if (to.opacity !== undefined) el.style.opacity = String(to.opacity);
                            if (to.transform !== undefined) el.style.transform = to.transform;
                            if (opts.complete) setTimeout(opts.complete!, opts.duration + 50);
                        });
                    });
                };
                if ((opts.delay ?? 0) > 0) {
                    setTimeout(run, opts.delay);
                } else {
                    run();
                }
            }

            getIcon(type: string): string {
                const svg = (path: string) =>
                    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
                const icons: Record<string, string> = {
                    success:  svg('<polyline points="20 6 9 17 4 12"/>'),
                    error:    svg('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),
                    warning:  svg('<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'),
                    info:     svg('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'),
                    question: svg('<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>'),
                    loading:  '<div class="notify-toast-spinner" aria-hidden="true"></div>',
                };
                return icons[type] ?? icons['info'];
            }

            getDefaultTitle(type: string) {
                const titles: Record<string, string> = {
                    'success': '¡Éxito!',
                    'error': 'Error',
                    'warning': 'Advertencia',
                    'info': 'Información',
                    'question': 'Pregunta'
                };
                return titles[type] || 'Notificación';
            }

            getButtonGradient(type: string) {
                const gradients: Record<string, string> = {
                    'success': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    'error': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    'warning': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    'info': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    'question': 'linear-gradient(135deg, #8b5cf6 0%, #8b5cf6 100%)'
                };
                return gradients[type] || gradients.info;
            }

            getButtonShadow(type: string) {
                const shadows: Record<string, string> = {
                    'success': 'rgba(16, 185, 129, 0)',
                    'error': 'rgba(239, 68, 68, 0)',
                    'warning': 'rgba(245, 159, 11, 0)',
                    'info': 'rgba(59, 131, 246, 0)',
                    'question': 'rgba(139, 92, 246, 0)'
                };
                return shadows[type] || shadows.info;
            }

            show(options: NotificationOptions = {}): Promise<void> {
                options = { ...this._globalDefaults.modal, ...options };
                // Cerrar notificación existente si hay (esperar a que termine)
                if (this.currentNotification) {
                    const oldOverlay = this.currentNotification;
                    this.currentNotification = null;
                    try {
                        if (oldOverlay && oldOverlay.parentNode) {
                            oldOverlay.parentNode.removeChild(oldOverlay);
                        }
                    } catch (e) { }
                }

                const {
                    type = 'info',
                    title = this.getDefaultTitle(type),
                    message = '',
                    buttonText = 'OK',
                    buttonColor = null,
                    onClose = null,
                    timer = null,
                    allowOutsideClick = true,
                    allowEscapeKey = true,
                    hideButton = false,
                    buttons = null
                } = options;

                const showCloseButton = options.showCloseButton === true;

                try { document.body.style.overflow = 'hidden'; } catch (e) { }
                try { document.documentElement.style.overflow = 'hidden'; } catch (e) { }

                const overlay = document.createElement('div') as HTMLDivElement;
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
                } else {
                    icon.innerHTML = this.getIcon(type);
                }

                const titleElement = document.createElement('h3');
                titleElement.className = 'notification-title';
                titleElement.textContent = title;

                const messageElement = document.createElement('p');
                messageElement.className = 'notification-message';
                messageElement.textContent = message;

                let customContent: HTMLElement | null = null;
                if (options.html || options.content) {
                    customContent = document.createElement('div');
                    customContent.className = 'notification-content';
                    if (options.html) {
                        try { customContent.innerHTML = options.html; } catch (e) { customContent.textContent = options.html; }
                    } else if (options.content && options.content instanceof HTMLElement) {
                        customContent.appendChild(options.content);
                    }
                }

                const closeHandler = () => {
                    return this.close(onClose);
                };

                let button: HTMLButtonElement | null = null;
                let buttonContainer: HTMLElement | null = null;
                if (!hideButton) {
                    if (Array.isArray(buttons) && buttons.length) {
                        buttonContainer = document.createElement('div');
                        buttonContainer.className = 'notification-button-group';

                        buttons.forEach((btn: ButtonOptions) => {
                            const btnEl = document.createElement('button');
                            btnEl.className = 'notification-button';
                            btnEl.textContent = btn.text || 'OK';

                            const finalBtnColor = btn.color || this.getButtonGradient(type);
                            const btnShadow = btn.shadowColor || this.getButtonShadow(type);
                            btnEl.style.background = finalBtnColor;
                            btnEl.style.boxShadow = `0 4px 12px ${btnShadow}`;

                            btnEl.addEventListener('click', (e: MouseEvent) => {
                                e.stopPropagation();
                                e.preventDefault();
                                try {
                                    closeHandler().then(() => {
                                        if (typeof btn.onClick === 'function') {
                                            try {
                                                const res = btn.onClick();
                                                if (res && typeof (res as Promise<unknown>).then === 'function') {
                                                    (res as Promise<unknown>).catch((err: unknown) => console.error(err));
                                                }
                                            } catch (err: unknown) { console.error(err); }
                                        }
                                    }).catch(() => { });
                                } catch (err) {
                                    console.error(err);
                                }
                            });

                            btnEl.addEventListener('mouseenter', () => {
                                btnEl.style.boxShadow = `0 6px 16px ${btnShadow}`;
                            });
                            btnEl.addEventListener('mouseleave', () => {
                                btnEl.style.boxShadow = `0 4px 12px ${btnShadow}`;
                            });

                            buttonContainer!.appendChild(btnEl);
                        });
                    } else if (options.onConfirm || options.onCancel || options.confirmText || options.cancelText) {
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

                        cancelBtn.addEventListener('click', (e: MouseEvent) => {
                            e.stopPropagation(); e.preventDefault();
                            closeHandler().then(() => {
                                try {
                                    if (typeof options.onCancel === 'function') {
                                        const res = options.onCancel();
                                        if (res && typeof (res as Promise<unknown>).then === 'function') {
                                            (res as Promise<unknown>).catch((err: unknown) => console.error(err));
                                        }
                                    }
                                } catch (err: unknown) { console.error(err); }
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

                        confirmBtn.addEventListener('click', async (e: MouseEvent) => {
                            e.stopPropagation(); e.preventDefault();
                            try {
                                await closeHandler();
                                if (typeof options.onConfirm === 'function') {
                                    const res = options.onConfirm();
                                    if (res && typeof res.then === 'function') {
                                        await res;
                                    }
                                }
                            } catch (err) { console.error(err); }
                        });

                        confirmBtn.addEventListener('mouseenter', () => { confirmBtn.style.boxShadow = `0 6px 16px ${confirmShadow}`; });
                        confirmBtn.addEventListener('mouseleave', () => { confirmBtn.style.boxShadow = `0 4px 12px ${confirmShadow}`; });

                        buttonContainer.appendChild(cancelBtn);
                        buttonContainer.appendChild(confirmBtn);
                    } else if (buttonText) {
                        button = document.createElement('button');
                        button.className = 'notification-button';
                        button.textContent = buttonText;

                        const finalButtonColor = buttonColor || this.getButtonGradient(type);
                        const buttonShadowColor = this.getButtonShadow(type);
                        button.style.background = finalButtonColor;
                        button.style.boxShadow = `0 4px 12px ${buttonShadowColor}`;
                    }
                }

                let closeBtn: HTMLButtonElement | null = null;
                if (showCloseButton) {
                    closeBtn = document.createElement('button');
                    closeBtn.setAttribute('aria-label', 'Cerrar');
                    closeBtn.className = 'notification-close';
                    closeBtn.innerHTML = '&times;';
                    closeBtn.addEventListener('click', (e: MouseEvent) => {
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
                } else {
                    box.appendChild(titleElement);
                    box.appendChild(messageElement);
                }
                if (closeBtn) box.appendChild(closeBtn);
                if (buttonContainer) {
                    box.appendChild(buttonContainer);
                } else if (button) {
                    box.appendChild(button);
                }
                overlay.appendChild(box);
                document.body.appendChild(overlay);

                const overlayMeta = overlay as HTMLDivElement & OverlayMeta;
                const closePromise = new Promise<void>((resolveClose) => {
                    try { overlayMeta._externalResolve = resolveClose; } catch (e) { }
                });

                try {
                    const live = document.getElementById('notify-live');
                    if (live) {
                        live.textContent = `${title}: ${message}`;
                    }
                } catch (e) { }

                try { this._lastActiveElement = document.activeElement as HTMLElement | null; } catch (e) { this._lastActiveElement = null; }

                this.currentNotification = overlay;

                try {
                    const focusable = box.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
                    if (focusable && focusable.length) {
                        (focusable[0] as HTMLElement).focus();
                    } else if (button) {
                        (button as HTMLElement).focus();
                    } else {
                        overlay.focus();
                    }
                } catch (e) { try { overlay.focus(); } catch (err) { } }

                const focusTrap = (e: KeyboardEvent) => {
                    if (e.key !== 'Tab') return;
                    const focusableNodes = Array.from(box.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'));
                    const focusable = focusableNodes.filter((el): el is HTMLElement => el instanceof HTMLElement && el.offsetParent !== null);
                    if (!focusable.length) {
                        e.preventDefault();
                        return;
                    }
                    const first = focusable[0] as HTMLElement;
                    const last = focusable[focusable.length - 1] as HTMLElement;
                    if (!e.shiftKey && document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    } else if (e.shiftKey && document.activeElement === first) {
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

                // Set initial animation states before transitions begin
                overlay.style.opacity = '0';
                box.style.opacity = '0';
                box.style.transform = `scale(${boxStartScale})`;
                icon.style.opacity = '0';
                icon.style.transform = `scale(0) rotate(${iconRotate}deg)`;

                this._cssAnimate(overlay, { opacity: 1 }, { duration: overlayDuration, easing: overlayEasing });
                this._cssAnimate(box, { opacity: 1, transform: 'scale(1)' }, { duration: boxDuration, easing: boxEasing, delay: boxDelay });
                this._cssAnimate(icon, { opacity: 1, transform: 'scale(1) rotate(0deg)' }, { duration: iconDuration, easing: boxEasing, delay: iconDelay });

                if (button) {
                    const buttonShadowColor = this.getButtonShadow(type);
                    button.addEventListener('mouseenter', () => {
                        button.style.boxShadow = `0 6px 16px ${buttonShadowColor}`;
                    });
                    button.addEventListener('mouseleave', () => {
                        button.style.boxShadow = `0 4px 12px ${buttonShadowColor}`;
                    });
                    button.addEventListener('click', (e: MouseEvent) => {
                        e.stopPropagation();
                        e.preventDefault();
                        closeHandler().catch(() => { });
                    });
                }

                if (allowOutsideClick) {
                    overlay.addEventListener('click', (e: MouseEvent) => {
                        if (!box.contains(e.target as Node)) {
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
                    const escHandler = (e: KeyboardEvent) => {
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

            close(callback: (() => void) | null = null): Promise<void> {
                if (!this.currentNotification) {
                    return Promise.resolve();
                }

                const overlay = this.currentNotification as HTMLDivElement;
                const overlayMeta = overlay as HTMLDivElement & OverlayMeta;
                const box = overlay.querySelector('.notification-box');

                this.currentNotification = null;

                if (box instanceof HTMLElement) {
                    this._cssAnimate(box, { opacity: 0, transform: 'scale(0.8)' }, { duration: 100, easing: 'easeInQuad' });
                }

                return new Promise<void>((resolve) => {
                    this._cssAnimate(overlay, { opacity: 0 }, {
                        duration: 100,
                        easing: 'easeInQuad',
                        complete: () => {
                            try {
                                if (overlayMeta && overlayMeta._escHandler) {
                                    document.removeEventListener('keydown', overlayMeta._escHandler);
                                    overlayMeta._escHandler = undefined;
                                }
                            } catch (e) { }

                            try {
                                if (overlayMeta && overlayMeta._focusTrap) {
                                    document.removeEventListener('keydown', overlayMeta._focusTrap);
                                    overlayMeta._focusTrap = undefined;
                                }
                            } catch (e) { }

                            try {
                                if (overlayMeta && typeof overlayMeta._externalResolve === 'function') {
                                    try { overlayMeta._externalResolve(); } catch (er) { }
                                    overlayMeta._externalResolve = undefined;
                                }
                            } catch (e) { }

                            try {
                                if (overlay && overlay.parentNode) {
                                    overlay.parentNode.removeChild(overlay);
                                }
                            } catch (e) {
                                try { overlay.remove(); } catch (er) { }
                            }

                            if (!this.currentNotification) {
                                try { document.body.style.overflow = ''; } catch (e) { }
                                try { document.documentElement.style.overflow = ''; } catch (e) { }
                            }

                            try {
                                if (this._lastActiveElement && typeof this._lastActiveElement.focus === 'function') {
                                    this._lastActiveElement.focus();
                                }
                            } catch (e) { }
                            this._lastActiveElement = null;

                            if (callback) callback();
                            resolve();
                        }
                    });
                });
            }

            success(message: string, title: string | null = null, options: NotificationOptions = {}) {
                this.show({
                    type: 'success',
                    title: title || this.getDefaultTitle('success'),
                    message,
                    ...options
                });
            }

            error(message: string, title: string | null = null, options: NotificationOptions = {}) {
                this.show({
                    type: 'error',
                    title: title || this.getDefaultTitle('error'),
                    message,
                    ...options
                });
            }

            warning(message: string, title: string | null = null, options: NotificationOptions = {}) {
                this.show({
                    type: 'warning',
                    title: title || this.getDefaultTitle('warning'),
                    message,
                    ...options
                });
            }

            question(message: string, title: string | null = null, options: NotificationOptions = {}) {
                this.show({
                    type: 'question',
                    title: title || this.getDefaultTitle('question'),
                    message,
                    ...options
                });
            }

            info(message: string, title: string | null = null, options: NotificationOptions = {}) {
                this.show({
                    type: 'info',
                    title: title || this.getDefaultTitle('info'),
                    message,
                    ...options
                });
            }
            loading(message: string = 'Cargando...', title: string = 'Espera', options: NotificationOptions = {}) {
                const loadingOptions = {
                    type: 'info',
                    title,
                    message,
                    hideButton: true,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    ...options
                };

                const loadingPromise = this.show(loadingOptions);

                this._currentLoadingPromise = loadingPromise;

                return loadingPromise;
            }

            closeLoading(callback: (() => void) | null = null) {
                this._currentLoadingPromise = null;
                return this.close(callback);
            }

            hide(callback: (() => void) | null = null) { return this.close(callback); }
            hiden(callback: (() => void) | null = null) { return this.close(callback); }

            _formatTime(seconds: number) {
                const s = Math.max(0, Math.floor(seconds));
                const mm = Math.floor(s / 60).toString().padStart(2, '0');
                const ss = (s % 60).toString().padStart(2, '0');
                return `${mm}:${ss}`;
            }

            private _attachSwipeGesture(
                toast: HTMLDivElement,
                removeToast: () => Promise<void>,
                pauseCountdown: () => void,
                resumeCountdown: () => void
            ): void {
                if (this._prefersReducedMotion()) return;

                let startX = 0;
                let startY = 0;
                let startTime = 0;
                let dragging = false;
                let lockedAxis: 'x' | 'y' | null = null;

                const onPointerDown = (e: PointerEvent) => {
                    if (e.pointerType === 'mouse' && e.button !== 0) return;
                    startX = e.clientX;
                    startY = e.clientY;
                    startTime = e.timeStamp;
                    dragging = true;
                    lockedAxis = null;
                    toast.setPointerCapture(e.pointerId);
                    toast.classList.add('notify-toast-swiping');
                    pauseCountdown();
                };

                const onPointerMove = (e: PointerEvent) => {
                    if (!dragging) return;
                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;

                    if (!lockedAxis && Math.sqrt(dx * dx + dy * dy) > 10) {
                        lockedAxis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
                    }

                    const tx = lockedAxis === 'y' ? 0 : dx;
                    const ty = lockedAxis === 'x' ? 0 : dy;
                    const dist = Math.abs(lockedAxis === 'x' ? dx : dy);

                    toast.style.transform = `translate(${tx}px, ${ty}px)`;
                    toast.style.opacity = dist > 60
                        ? String(Math.max(0.35, 1 - (dist - 60) / 140))
                        : '';
                };

                const onPointerUp = (e: PointerEvent) => {
                    if (!dragging) return;
                    dragging = false;
                    toast.classList.remove('notify-toast-swiping');

                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;
                    const primary = lockedAxis === 'x' ? dx : dy;
                    const dist = Math.abs(primary);
                    const velocity = dist / Math.max(1, e.timeStamp - startTime);

                    const isUpward = lockedAxis === 'y' && dy < 0;
                    const distThreshold = isUpward ? 25 : 60;
                    const velThreshold  = isUpward ? 0.2 : 0.4;

                    if (dist >= distThreshold || velocity > velThreshold) {
                        const exitDist = Math.max(window.innerWidth, window.innerHeight);
                        const exitX = lockedAxis === 'x' ? Math.sign(dx) * exitDist : 0;
                        const exitY = lockedAxis === 'y' ? Math.sign(dy) * exitDist : 0;
                        toast.style.transition = 'transform 300ms ease-in, opacity 300ms ease-in';
                        toast.style.transform = `translate(${exitX}px, ${exitY}px)`;
                        toast.style.opacity = '0';
                        removeToast();
                    } else {
                        toast.style.transition = 'transform 200ms ease-out, opacity 200ms ease-out';
                        toast.style.transform = '';
                        toast.style.opacity = '';
                        setTimeout(() => { toast.style.transition = ''; }, 200);
                        resumeCountdown();
                    }
                };

                toast.addEventListener('pointerdown', onPointerDown);
                toast.addEventListener('pointermove', onPointerMove);
                toast.addEventListener('pointerup', onPointerUp);
                toast.addEventListener('pointercancel', onPointerUp);
            }

            showToast(message: string, options: ToastOptions = {}): void {
                const opts: ToastOptions = { ...this._globalDefaults.toast, ...options };
                const type = opts.type || 'info';
                const title = opts.title ?? null;
                const duration = typeof opts.duration === 'number' ? opts.duration : 4000;
                const position = opts.position || 'top-right';
                const showProgress = opts.showProgress !== false;
                const toastId = opts.id ?? null;
                const closeable = opts.closeable !== false;
                const swipeToDismiss = opts.swipeToDismiss !== false;

                // Deduplicación: si ya existe un toast con este ID, resetear su cuenta regresiva
                if (toastId !== null) {
                    const existing = this._toastInstances.get(toastId);
                    if (existing) {
                        existing.reset(duration);
                        return;
                    }
                }

                let container = this._toastContainers.get(position);
                if (!container || !document.body.contains(container)) {
                    container = document.createElement('div');
                    container.className = `notify-toast-container notify-toast-${position}`;
                    container.setAttribute('aria-label', 'Notificaciones');
                    document.body.appendChild(container);
                    this._toastContainers.set(position, container);
                }

                const isBottom = position.startsWith('bottom');
                const isCenter = position === 'top-center';
                const toast = document.createElement('div');
                toast.className = 'notify-toast';
                if (!closeable) {
                    toast.classList.add('notify-toast-no-close');
                }
                // Accesibilidad: role + aria-live según la urgencia del tipo
                // role="alert" implica aria-live="assertive" + aria-atomic="true" → lector lo interrumpe
                // role="status" implica aria-live="polite" + aria-atomic="true" → lector espera pausa
                if (type === 'error' || type === 'warning') {
                    toast.setAttribute('role', 'alert');
                } else {
                    toast.setAttribute('role', 'status');
                }
                toast.setAttribute('aria-atomic', 'true');
                toast.setAttribute('aria-live', type === 'error' || type === 'warning' ? 'assertive' : 'polite');

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

                toast.appendChild(iconEl);
                toast.appendChild(contentEl);

                if (closeable) {
                    const closeBtn = document.createElement('button');
                    closeBtn.className = 'notify-toast-close';
                    closeBtn.setAttribute('aria-label', 'Cerrar notificación');
                    closeBtn.innerHTML = '&times;';
                    closeBtn.addEventListener('click', removeToast);
                    toast.appendChild(closeBtn);
                }

                let progressEl: HTMLDivElement | null = null;
                if (duration > 0 && showProgress) {
                    progressEl = document.createElement('div');
                    progressEl.className = `notify-toast-progress ${type}`;
                    progressEl.setAttribute('role', 'progressbar');
                    progressEl.setAttribute('aria-hidden', 'true'); // decorativo: el timer no añade info que el usuario necesite leer
                    toast.appendChild(progressEl);
                }

                if (isBottom || isCenter) {
                    container.appendChild(toast);
                } else {
                    container.insertBefore(toast, container.firstChild);
                }

                let dismissed = false;
                let timerId: ReturnType<typeof setTimeout> | null = null;
                let remaining = duration;
                let timerStartedAt = 0;

                function removeToast(): Promise<void> {
                    if (dismissed) return Promise.resolve();
                    dismissed = true;
                    // Si el foco estaba dentro del toast, sacarlo antes de que el nodo desaparezca
                    // para evitar que el foco se pierda silenciosamente en el documento
                    if (toast.contains(document.activeElement as Node)) {
                        try { (document.activeElement as HTMLElement).blur(); } catch (e) { }
                    }
                    toast.classList.remove('notify-toast-visible');
                    return new Promise(resolve => {
                        setTimeout(() => {
                            if (toast.parentNode) toast.parentNode.removeChild(toast);
                            resolve();
                        }, 300);
                    });
                }

                const startCountdown = (ms: number) => {
                    timerStartedAt = Date.now();
                    timerId = setTimeout(() => {
                        if (toastId !== null) this._toastInstances.delete(toastId);
                        removeToast();
                    }, ms);
                    if (progressEl) {
                        progressEl.style.transition = `width ${ms}ms linear`;
                        progressEl.style.width = '0%';
                    }
                };

                const pauseCountdown = () => {
                    if (dismissed || timerId === null) return;
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
                    if (dismissed || remaining <= 0) return;
                    startCountdown(remaining);
                };

                const resetCountdown = (newDuration: number) => {
                    if (dismissed) return;
                    if (timerId !== null) {
                        clearTimeout(timerId);
                        timerId = null;
                    }
                    remaining = newDuration;
                    if (newDuration > 0) {
                        if (progressEl) {
                            progressEl.style.transition = 'none';
                            progressEl.style.width = '100%';
                            // Forzar reflow para que la transición se aplique desde el inicio
                            void progressEl.offsetWidth;
                        }
                        startCountdown(newDuration);
                    } else if (progressEl) {
                        progressEl.style.transition = 'none';
                        progressEl.style.width = '100%';
                    }
                };

                if (toastId !== null) {
                    const silentDismiss = () => {
                        if (dismissed) return;
                        dismissed = true;
                        if (timerId !== null) clearTimeout(timerId);
                        if (toast.contains(document.activeElement as Node)) {
                            try { (document.activeElement as HTMLElement).blur(); } catch (e) { }
                        }
                        if (toast.parentNode) toast.parentNode.removeChild(toast);
                    };
                    this._toastInstances.set(toastId, { reset: resetCountdown, dismiss: removeToast, _silentDismiss: silentDismiss });
                }

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        toast.classList.add('notify-toast-visible');
                        if (duration > 0) {
                            startCountdown(duration);
                        }
                    });
                });

                if (duration > 0 && closeable) {
                    toast.addEventListener('mouseenter', pauseCountdown);
                    toast.addEventListener('mouseleave', resumeCountdown);
                }

                if (swipeToDismiss && closeable) {
                    this._attachSwipeGesture(toast, removeToast, pauseCountdown, resumeCountdown);
                }
            }

            toast(messageOrOptions: string | ToastOptions, options: ToastOptions = {}): void {
                if (typeof messageOrOptions === 'string') {
                    this.showToast(messageOrOptions, options);
                } else {
                    const { message = '', ...rest } = messageOrOptions;
                    this.showToast(message, rest);
                }
            }

            toastSuccess(message: string, title?: string, options: ToastOptions = {}): void {
                this.showToast(message, { ...options, type: 'success', title: title ?? options.title });
            }

            toastError(message: string, title?: string, options: ToastOptions = {}): void {
                this.showToast(message, { ...options, type: 'error', title: title ?? options.title });
            }

            toastWarning(message: string, title?: string, options: ToastOptions = {}): void {
                this.showToast(message, { ...options, type: 'warning', title: title ?? options.title });
            }

            toastInfo(message: string, title?: string, options: ToastOptions = {}): void {
                this.showToast(message, { ...options, type: 'info', title: title ?? options.title });
            }

            toastQuestion(message: string, title?: string, options: ToastOptions = {}): void {
                this.showToast(message, { ...options, type: 'question', title: title ?? options.title });
            }

            /**
             * Muestra un toast de carga con spinner.
             * - No se puede cerrar manualmente (closeable: false por defecto).
             * - No tiene cuenta regresiva (duration: 0 por defecto).
             * - Solo puede existir uno a la vez (id '__loading__').
             * Ciérralo con notify.closeToastLoading().
             */
            toastLoading(message: string = 'Cargando...', title?: string, options: ToastOptions = {}): void {
                this.showToast(message, {
                    position: 'top-right',
                    ...options,
                    type: 'loading',
                    title: title ?? options.title,
                    id: '__loading__',
                    closeable: false,
                    swipeToDismiss: false,
                    duration: 0,
                    showProgress: false,
                });
            }

            /** Cierra el toast de carga activo (si existe). Devuelve una Promise que resuelve cuando la animación de salida termina (≈300 ms). */
            closeToastLoading(): Promise<void> {
                const entry = this._toastInstances.get('__loading__');
                if (entry) {
                    this._toastInstances.delete('__loading__');
                    return entry.dismiss();
                }
                return Promise.resolve();
            }

            /**
             * Reemplaza el toast de carga activo por un toast de resultado en el mismo lugar,
             * sin animación de salida/entrada — no hay solapamiento ni hueco visual.
             * Si no existe un toast de carga activo, simplemente muestra un toast normal.
             */
            replaceToastLoading(message: string, options: ToastOptions = {}): void {
                const entry = this._toastInstances.get('__loading__');
                if (entry) {
                    this._toastInstances.delete('__loading__');
                    entry._silentDismiss();
                }
                this.showToast(message, options);
            }
        }

        const notifyInstance = new NotificationSystem();
        const w = window as unknown as { notify: NotificationSystem; Notification: NotificationSystem };
        w.notify = notifyInstance;
        w.Notification = notifyInstance;
    }
    initFerNotify();
})();
