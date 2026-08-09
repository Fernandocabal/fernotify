// Type definitions for fernotify
// Generated from notification-system.ts

export interface ButtonOptions {
    text?: string;
    color?: string;
    shadowColor?: string;
    onClick?: (() => void) | (() => Promise<unknown>);
}

export interface AnimationOptions {
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

export interface NotificationOptions {
    type?: 'success' | 'error' | 'warning' | 'info' | 'question' | string;
    title?: string;
    message?: string;
    html?: string;
    content?: HTMLElement;
    buttonText?: string;
    buttonColor?: string | null;
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

export type ToastPosition =
    | 'top-right'
    | 'top-left'
    | 'top-center'
    | 'bottom-right'
    | 'bottom-left';

export interface ToastOptions {
    type?: 'success' | 'error' | 'warning' | 'info' | 'question' | string;
    title?: string;
    message?: string;
    duration?: number;
    position?: ToastPosition;
    showProgress?: boolean;
    /**
     * Unique ID for deduplication: if a toast with this ID is already visible,
     * its countdown is reset instead of creating a duplicate.
     */
    id?: string;
    /**
     * When `false`, the close (×) button is hidden.
     * `toastLoading()` sets this to `false` automatically.
     * @default true
     */
    closeable?: boolean;
    /**
     * When `false`, disables the swipe/drag-to-dismiss gesture.
     * `toastLoading()` sets this to `false` automatically.
     * @default true
     */
    swipeToDismiss?: boolean;
}

export interface GlobalDefaults {
    /** Default options applied to every toast. Per-call options override these. */
    toast?: Partial<ToastOptions>;
    /** Default options applied to every modal. Per-call options override these. */
    modal?: Partial<NotificationOptions>;
}

export declare class NotificationSystem {
    constructor();

    /**
     * Set global default options for toasts and/or modals.
     * Per-call options always override these defaults.
     * Returns `this` for chaining.
     *
     * @example
     * notify.configure({ toast: { position: 'top-center', swipeToDismiss: true } });
     */
    configure(defaults: GlobalDefaults): this;

    // ── Modal notifications ──────────────────────────────────────────────────

    /** Shows a modal notification. Returns a Promise that resolves when the modal is closed. */
    show(options?: NotificationOptions): Promise<void>;

    /** Closes the current modal. */
    close(callback?: (() => void) | null): Promise<void>;

    /** Alias for close(). */
    hide(callback?: (() => void) | null): Promise<void>;

    success(message: string, title?: string | null, options?: NotificationOptions): void;
    error(message: string, title?: string | null, options?: NotificationOptions): void;
    warning(message: string, title?: string | null, options?: NotificationOptions): void;
    info(message: string, title?: string | null, options?: NotificationOptions): void;
    question(message: string, title?: string | null, options?: NotificationOptions): void;

    /** Shows a loading modal (no close button, blocks outside click / Escape). */
    loading(message?: string, title?: string, options?: NotificationOptions): Promise<void>;

    /** Closes the loading modal. */
    closeLoading(callback?: (() => void) | null): Promise<void>;

    // ── Toast notifications ──────────────────────────────────────────────────

    /** Generic toast. Accepts a message string + options, or a single options object. */
    toast(messageOrOptions: string | ToastOptions, options?: ToastOptions): void;

    toastSuccess(message: string, title?: string, options?: ToastOptions): void;
    toastError(message: string, title?: string, options?: ToastOptions): void;
    toastWarning(message: string, title?: string, options?: ToastOptions): void;
    toastInfo(message: string, title?: string, options?: ToastOptions): void;
    toastQuestion(message: string, title?: string, options?: ToastOptions): void;

    /**
     * Shows a loading toast with a spinner.
     * Only one loading toast can exist at a time (uses internal id `'__loading__'`).
     * Close it with `closeToastLoading()`.
     */
    toastLoading(message?: string, title?: string, options?: ToastOptions): void;

    /**
     * Closes the active loading toast and returns a Promise that resolves
     * after the exit animation finishes (~300 ms).
     *
     * @example
     * notify.toastLoading('Saving…');
     * await doWork();
     * await notify.closeToastLoading();   // wait for exit animation
     * notify.toastSuccess('Done!');
     */
    closeToastLoading(): Promise<void>;

    /**
     * Instantly replaces the loading toast with a new toast (no animation gap).
     * If no loading toast is active, behaves like a normal `toast()` call.
     *
     * @example
     * notify.toastLoading('Saving…');
     * await doWork();
     * notify.replaceToastLoading('Done!', { type: 'success' });
     */
    replaceToastLoading(message: string, options?: ToastOptions): void;
}

/**
 * Default export: the `NotificationSystem` class.
 *
 * @example – ESM / Vite / React
 * ```ts
 * import NotificationSystem from 'fernotify';
 * const notify = new NotificationSystem();
 * notify.toastSuccess('Hello!');
 * ```
 *
 * @example – Singleton (recommended for apps)
 * ```ts
 * // src/lib/notify.ts
 * import NotificationSystem from 'fernotify';
 * const notify = new NotificationSystem();
 * export default notify;
 * ```
 */
export default NotificationSystem;

// Augment the global Window interface so window.notify is typed
// when the UMD/IIFE bundle is loaded via <script>.
declare global {
    interface Window {
        notify: NotificationSystem;
        /** @deprecated Use window.notify instead. */
        Notification: NotificationSystem;
    }
}
