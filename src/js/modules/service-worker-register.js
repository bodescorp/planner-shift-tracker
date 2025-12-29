// ========================================
// SERVICE WORKER (PWA)
// ========================================

export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/src/js/sw.js')
        });
    }
}
