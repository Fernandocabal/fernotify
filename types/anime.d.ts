// Tipos mínimos para anime.js 3.x cargado por CDN
// Solo cubre las propiedades usadas en notification-system.ts

type AnimeValue = number | number[];

interface AnimeParams {
    targets: unknown;
    duration?: number;
    delay?: number;
    easing?: string;
    opacity?: AnimeValue;
    scale?: AnimeValue;
    rotate?: AnimeValue;
    complete?: () => void;
}

declare function anime(params: AnimeParams): void;
