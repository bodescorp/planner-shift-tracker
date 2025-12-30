/**
 * Módulo de Swipe Gestures
 * Detecta gestos de swipe para navegação mobile
 */

export class SwipeGestures {
    constructor() {
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.minSwipeDistance = 50;
        this.maxVerticalDistance = 100;
        
        this.init();
    }

    init() {
        this.setupSwipeToNavigate();
        this.setupSwipeToCloseModal();
        this.setupPullToRefresh();
    }

    /**
     * Swipe horizontal para navegar entre abas
     */
    setupSwipeToNavigate() {
        const mainContent = document.querySelector('.main-content, body');
        if (!mainContent) return;

        let touchstartX = 0;
        let touchendX = 0;

        mainContent.addEventListener('touchstart', (e) => {
            // Ignorar se estiver em um modal ou menu aberto
            if (document.querySelector('.modal.active, .side-menu.active')) {
                return;
            }
            touchstartX = e.changedTouches[0].screenX;
        }, { passive: true });

        mainContent.addEventListener('touchend', (e) => {
            if (document.querySelector('.modal.active, .side-menu.active')) {
                return;
            }
            
            touchendX = e.changedTouches[0].screenX;
            this.handleSwipeNavigation(touchstartX, touchendX);
        }, { passive: true });
    }

    handleSwipeNavigation(startX, endX) {
        const diff = startX - endX;
        const absDiff = Math.abs(diff);

        if (absDiff < this.minSwipeDistance) return;

        const tabs = Array.from(document.querySelectorAll('.tab-btn'));
        const activeTab = tabs.find(tab => tab.classList.contains('active'));
        if (!activeTab) return;

        const currentIndex = tabs.indexOf(activeTab);
        let nextIndex = currentIndex;

        // Swipe left = próxima tab
        if (diff > 0 && currentIndex < tabs.length - 1) {
            nextIndex = currentIndex + 1;
        }
        // Swipe right = tab anterior
        else if (diff < 0 && currentIndex > 0) {
            nextIndex = currentIndex - 1;
        }

        if (nextIndex !== currentIndex) {
            tabs[nextIndex].click();
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(30);
            }
        }
    }

    /**
     * Swipe down para fechar modais
     */
    setupSwipeToCloseModal() {
        document.addEventListener('touchstart', (e) => {
            const modal = e.target.closest('.modal-content');
            if (modal) {
                this.touchStartY = e.touches[0].clientY;
            }
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            const modal = e.target.closest('.modal-content');
            if (modal && this.touchStartY) {
                const currentY = e.touches[0].clientY;
                const diff = currentY - this.touchStartY;
                
                // Apenas permitir swipe down do topo do modal
                if (diff > 0 && modal.scrollTop === 0) {
                    modal.style.transform = `translateY(${diff * 0.5}px)`;
                    modal.style.opacity = Math.max(0.5, 1 - (diff / 500));
                }
            }
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            const modal = e.target.closest('.modal-content');
            if (modal && this.touchStartY) {
                const currentY = e.changedTouches[0].clientY;
                const diff = currentY - this.touchStartY;
                
                if (diff > 150) {
                    // Fechar modal
                    const closeBtn = modal.closest('.modal').querySelector('.modal-close');
                    if (closeBtn) closeBtn.click();
                    
                    if (navigator.vibrate) {
                        navigator.vibrate(50);
                    }
                } else {
                    // Resetar posição
                    modal.style.transform = '';
                    modal.style.opacity = '';
                }
                
                this.touchStartY = 0;
            }
        }, { passive: true });
    }

    /**
     * Pull to refresh
     */
    setupPullToRefresh() {
        let pullStartY = 0;
        let pullMoveY = 0;
        let refreshTriggered = false;
        const threshold = 80;

        const pullIndicator = document.createElement('div');
        pullIndicator.className = 'pull-to-refresh-indicator';
        pullIndicator.innerHTML = `
            <div class="pull-spinner"></div>
            <span class="pull-text">Puxe para atualizar</span>
        `;
        document.body.appendChild(pullIndicator);

        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0 && !document.querySelector('.modal.active')) {
                pullStartY = e.touches[0].clientY;
            }
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (pullStartY && !refreshTriggered) {
                pullMoveY = e.touches[0].clientY - pullStartY;
                
                if (pullMoveY > 0 && pullMoveY < 200) {
                    e.preventDefault();
                    pullIndicator.style.transform = `translateY(${Math.min(pullMoveY, threshold)}px)`;
                    pullIndicator.style.opacity = Math.min(pullMoveY / threshold, 1);
                    
                    if (pullMoveY >= threshold) {
                        pullIndicator.classList.add('ready');
                        pullIndicator.querySelector('.pull-text').textContent = 'Solte para atualizar';
                    } else {
                        pullIndicator.classList.remove('ready');
                        pullIndicator.querySelector('.pull-text').textContent = 'Puxe para atualizar';
                    }
                }
            }
        }, { passive: false });

        document.addEventListener('touchend', () => {
            if (pullMoveY >= threshold && !refreshTriggered) {
                refreshTriggered = true;
                pullIndicator.classList.add('refreshing');
                pullIndicator.querySelector('.pull-text').textContent = 'Atualizando...';
                
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }

                // Simular refresh
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                pullIndicator.style.transform = '';
                pullIndicator.style.opacity = '0';
                pullIndicator.classList.remove('ready');
            }
            
            pullStartY = 0;
            pullMoveY = 0;
        }, { passive: true });
    }
}

// CSS para Swipe Gestures
const swipeStyles = `
.pull-to-refresh-indicator {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    z-index: 9999;
    transform: translateY(-100px);
    opacity: 0;
    transition: opacity 0.2s ease;
}

.pull-to-refresh-indicator.ready {
    background: rgba(16, 185, 129, 0.1);
}

.pull-to-refresh-indicator.refreshing .pull-spinner {
    animation: spin 0.8s linear infinite;
}

.pull-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-top-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
}

.pull-to-refresh-indicator.ready .pull-spinner {
    border-top-color: rgba(16, 185, 129, 1);
}

.pull-text {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.85rem;
    font-weight: 300;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
    .pull-to-refresh-indicator {
        transition: none;
    }
    
    .pull-spinner {
        animation: none !important;
    }
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = swipeStyles;
document.head.appendChild(styleSheet);

export default SwipeGestures;
