/**
 * Sistema de Notificaciones Modernas - Estilo SweetAlert2
 * Usa anime.js para animaciones fluidas
 */

class NotificationSystem {
    constructor() {
        this.currentNotification = null;
        this._lastActiveElement = null;
        this.injectStyles();
    }

    /**
     * Inyectar estilos CSS
     */
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
        `;
        document.head.appendChild(style);
    }

    /**
     * Obtener ícono según el tipo
     */
    getIcon(type) {
        // Return a Boxicons markup string — presentation/index.php now imports the CSS.
        const icons = {
            'success': '<i class="bx bx-check" aria-hidden="true"></i>',
            'error': '<i class="bx bx-x" aria-hidden="true"></i>',
            'warning': '<i class="bx bx-error" aria-hidden="true"></i>',
            'info': '<i class="bx bx-info-circle" aria-hidden="true"></i>'
        };
        return icons[type] || icons.info;
    }

    /**
     * Obtener título por defecto según el tipo
     */
    getDefaultTitle(type) {
        const titles = {
            'success': '¡Éxito!',
            'error': 'Error',
            'warning': 'Advertencia',
            'info': 'Información'
        };
        return titles[type] || 'Notificación';
    }

    /**
     * Obtener gradiente de botón según el tipo
     */
    getButtonGradient(type) {
        const gradients = {
            'success': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            'error': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            'warning': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            'info': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
        };
        return gradients[type] || gradients.info;
    }

    /**
     * Obtener color de sombra según el tipo
     */
    getButtonShadow(type) {
        const shadows = {
            'success': 'rgba(16, 185, 129, 0.4)',
            'error': 'rgba(239, 68, 68, 0.4)',
            'warning': 'rgba(245, 158, 11, 0.4)',
            'info': 'rgba(59, 130, 246, 0.4)'
        };
        return shadows[type] || shadows.info;
    }

    /**
     * Mostrar notificación
     * 
     * @param {Object} options - Opciones de la notificación
     * @param {string} options.type - Tipo: 'success', 'error', 'warning', 'info'
     * @param {string} options.title - Título (opcional, usa título por defecto)
     * @param {string} options.message - Mensaje a mostrar
     * @param {string} options.buttonText - Texto del botón (opcional, default: 'OK')
     * @param {string} options.buttonColor - Color del botón en formato CSS (opcional, usa color del tipo por defecto)
     * @param {Function} options.onClose - Callback al cerrar (opcional)
     * @param {number} options.timer - Auto-cerrar después de X ms (opcional)
     * @param {boolean} options.allowOutsideClick - Permitir cerrar haciendo click fuera (default: true)
     * @param {boolean} options.allowEscapeKey - Permitir cerrar con tecla ESC (default: true)
     */
    show(options = {}) {
        // Cerrar notificación existente si hay
        if (this.currentNotification) {
            this.close();
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
            // New option: hideButton true -> do not render action button
            hideButton = false
        } = options;

        // Option to show a small close 'X' in the corner
        const showCloseButton = options.showCloseButton === true;

        // Bloquear scroll del body y root (más robusto)
        try { document.body.style.overflow = 'hidden'; } catch (e) { }
        try { document.documentElement.style.overflow = 'hidden'; } catch (e) { }

        // Crear overlay
        const overlay = document.createElement('div');
        overlay.className = 'notification-overlay';
        // Accessibility: make overlay focusable and a dialog
        overlay.tabIndex = -1;
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        // Ensure overlay receives pointer events
        overlay.style.pointerEvents = 'auto';

        // Crear box
        const box = document.createElement('div');
        box.className = 'notification-box';

        // Crear ícono
        const icon = document.createElement('div');
        icon.className = `notification-icon ${type}`;
        icon.innerHTML = this.getIcon(type);

        // Crear título
        const titleElement = document.createElement('h3');
        titleElement.className = 'notification-title';
        titleElement.textContent = title;

        // Crear mensaje
        const messageElement = document.createElement('p');
        messageElement.className = 'notification-message';
        messageElement.textContent = message;

        // Custom content support: options.html (string) or options.content (HTMLElement)
        let customContent = null;
        if (options.html || options.content) {
            customContent = document.createElement('div');
            customContent.className = 'notification-content';
            if (options.html) {
                try { customContent.innerHTML = options.html; } catch (e) { customContent.textContent = options.html; }
            } else if (options.content && options.content instanceof HTMLElement) {
                customContent.appendChild(options.content);
            }
        }

        // Crear (opcional) botón. Si hideButton === true o buttonText es falsy, no renderizamos.
        let button = null;
        if (!hideButton && buttonText) {
            button = document.createElement('button');
            button.className = 'notification-button';
            button.textContent = buttonText;

            // Aplicar color del botón (personalizado o automático según tipo)
            const finalButtonColor = buttonColor || this.getButtonGradient(type);
            const buttonShadowColor = this.getButtonShadow(type);
            button.style.background = finalButtonColor;
            button.style.boxShadow = `0 4px 12px ${buttonShadowColor}`;
        }

        // Close 'X' button in corner (optional)
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

        // Ensamblar
        box.appendChild(icon);
        // If customContent provided, prefer it. Otherwise render title/message as before.
        if (customContent) {
            // For accessibility, link aria-describedby to the content
            const descId = 'notify-desc-' + Date.now();
            customContent.id = descId;
            overlay.setAttribute('aria-describedby', descId);
            box.appendChild(customContent);
        } else {
            box.appendChild(titleElement);
            box.appendChild(messageElement);
        }
        // Append close button last so it's visually on top
        if (closeBtn) box.appendChild(closeBtn);
        if (button) box.appendChild(button);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        // Provide a Promise that resolves when this notification is closed.
        const closePromise = new Promise((resolveClose) => {
            try { overlay._externalResolve = resolveClose; } catch (e) { /* ignore */ }
        });

        // If page provides a live region, update it for screen readers
        try {
            const live = document.getElementById('notify-live');
            if (live) {
                live.textContent = `${title}: ${message}`;
            }
        } catch (e) { }

        // Save current focused element to restore later
        try { this._lastActiveElement = document.activeElement; } catch (e) { this._lastActiveElement = null; }

        // Debug (use console.log to avoid being filtered out)
        try { console.log('notify.show:', { type, title, message, hideButton, allowOutsideClick, allowEscapeKey }); } catch (e) { }

        this.currentNotification = overlay;

        // Move focus into the notification for accessibility
        // Focus management: focus first focusable element inside box, otherwise the button, otherwise overlay
        try {
            const focusable = box.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
            if (focusable && focusable.length) {
                focusable[0].focus();
            } else if (button) {
                button.focus();
            } else {
                overlay.focus();
            }
        } catch (e) { try { overlay.focus(); } catch (err) { } }

        // Implement focus trap (Tab/Shift+Tab) inside the box
        const focusTrap = (e) => {
            if (e.key !== 'Tab') return;
            const focusable = Array.from(box.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'))
                .filter(el => el.offsetParent !== null);
            if (!focusable.length) {
                e.preventDefault();
                return;
            }
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            } else if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        };
        overlay._focusTrap = focusTrap;
        document.addEventListener('keydown', focusTrap);

        // Allow optional animation overrides via options.anim
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

        // Animación de entrada con anime.js - configurable
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

        // Efecto hover y listener del botón (solo si existe)
        const closeHandler = () => {
            this.close(onClose);
        };
        if (button) {
            const buttonShadowColor = this.getButtonShadow(type);
            button.addEventListener('mouseenter', () => {
                button.style.boxShadow = `0 6px 16px ${buttonShadowColor}`;
            });
            button.addEventListener('mouseleave', () => {
                button.style.boxShadow = `0 4px 12px ${buttonShadowColor}`;
            });
            button.addEventListener('click', (e) => {
                try { console.log('notify.button.click'); } catch (err) { }
                closeHandler(e);
            });
        }

        // Click en overlay para cerrar (solo si está permitido)
        if (allowOutsideClick) {
            overlay.addEventListener('click', (e) => {
                try { console.log('notify.overlay.click', e.target); } catch (err) { }
                // Close when clicking outside the box (more robust than e.target === overlay)
                if (!box.contains(e.target)) {
                    closeHandler();
                }
            });
        }

        // Auto-cerrar si hay timer
        if (timer) {
            setTimeout(() => {
                closeHandler();
            }, timer);
        }

        // Tecla ESC para cerrar (solo si está permitido)
        if (allowEscapeKey) {
            const escHandler = (e) => {
                try { console.log('notify.esc', e.key); } catch (err) { }
                if (e.key === 'Escape') {
                    closeHandler();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            // Store handler reference on overlay so close() can remove it if needed
            overlay._escHandler = escHandler;
            document.addEventListener('keydown', escHandler);
        }

        // Return a Promise that resolves when the notification is closed
        return closePromise;
    }

    /**
     * Cerrar notificación actual
     */
    close(callback = null) {
        if (!this.currentNotification) return Promise.resolve();

        const overlay = this.currentNotification;
        const box = overlay.querySelector('.notification-box');

        // Animación de salida
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
                    try { console.log('notify.close'); } catch (e) { }
                    // Remove keydown handler if present
                    try {
                        if (overlay && overlay._escHandler) {
                            document.removeEventListener('keydown', overlay._escHandler);
                            overlay._escHandler = null;
                        }
                    } catch (e) { }

                    // Remove focus trap if present
                    try {
                        if (overlay && overlay._focusTrap) {
                            document.removeEventListener('keydown', overlay._focusTrap);
                            overlay._focusTrap = null;
                        }
                    } catch (e) { }

                    // Resolve external Promise returned by show(), if present
                    try {
                        if (overlay && typeof overlay._externalResolve === 'function') {
                            try { overlay._externalResolve(); } catch (er) { }
                            overlay._externalResolve = null;
                        }
                    } catch (e) { }

                    // Remove this overlay
                    try { overlay.remove(); } catch (e) { }
                    this.currentNotification = null;
                    // Restaurar scroll del body y root
                    try { document.body.style.overflow = ''; } catch (e) { }
                    try { document.documentElement.style.overflow = ''; } catch (e) { }
                    // Restore previous focus if possible
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

    /**
     * Métodos de acceso rápido
     */
    success(message, title = null, options = {}) {
        try { console.log('notify.success called', { message, title, options }); } catch (e) { }
        this.show({
            type: 'success',
            title: title || this.getDefaultTitle('success'),
            message,
            ...options
        });
    }

    error(message, title = null, options = {}) {
        this.show({
            type: 'error',
            title: title || this.getDefaultTitle('error'),
            message,
            ...options
        });
    }

    warning(message, title = null, options = {}) {
        this.show({
            type: 'warning',
            title: title || this.getDefaultTitle('warning'),
            message,
            ...options
        });
    }

    info(message, title = null, options = {}) {
        try { console.log('notify.info called', { message, title, options }); } catch (e) { }
        this.show({
            type: 'info',
            title: title || this.getDefaultTitle('info'),
            message,
            ...options
        });
    }

    /**
     * Alias para cerrar/ocultar la notificación actual
     */
    hide(callback = null) {
        return this.close(callback);
    }

    /**
     * Compatibilidad con nombre mal escrito 'hiden'
     */
    hiden(callback = null) {
        return this.close(callback);
    }

    /**
     * Formatea segundos a mm:ss
     */
    _formatTime(seconds) {
        const s = Math.max(0, Math.floor(seconds));
        const mm = Math.floor(s / 60).toString().padStart(2, '0');
        const ss = (s % 60).toString().padStart(2, '0');
        return `${mm}:${ss}`;
    }

}

// ES Module: Exportar la clase
export default NotificationSystem;

// Si se usa en un contexto no-module, crear instancia global
if (typeof window !== 'undefined' && !window.notify) {
    window.notify = new NotificationSystem();
    window.Notification = window.notify;
}

