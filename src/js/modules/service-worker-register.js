// ========================================
// SERVICE WORKER (PWA)
// ========================================

export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/src/js/sw.js')
                .then(reg => console.log('Service Worker registrado'))
                .catch(err => console.log('Erro ao registrar Service Worker:', err));
        });
    }
}
