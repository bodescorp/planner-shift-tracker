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
        this.minSwipeDistance = 80; // Aumentado para reduzir sensibilidade
        this.maxVerticalDistance = 50; // Reduzido para evitar swipes acidentais
        
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
        let touchstartY = 0;
        let touchendX = 0;
        let touchendY = 0;

        mainContent.addEventListener('touchstart', (e) => {
            // Ignorar se estiver em um modal, menu aberto, pet-viewer ou canvas
            if (document.querySelector('.modal.active, .side-menu.active')) {
                return;
            }
            
            // Ignorar se estiver tocando no pet-viewer ou canvas (mascote 3D)
            if (e.target.closest('.pet-viewer, canvas')) {
                return;
            }
            
            touchstartX = e.changedTouches[0].screenX;
            touchstartY = e.changedTouches[0].screenY;
        }, { passive: true });

        mainContent.addEventListener('touchend', (e) => {
            if (document.querySelector('.modal.active, .side-menu.active')) {
                return;
            }
            
            // Ignorar se estiver tocando no pet-viewer ou canvas
            if (e.target.closest('.pet-viewer, canvas')) {
                return;
            }
            
            touchendX = e.changedTouches[0].screenX;
            touchendY = e.changedTouches[0].screenY;
            
            // Verificar se o movimento vertical é maior que o horizontal (scroll)
            const horizontalDiff = Math.abs(touchendX - touchstartX);
            const verticalDiff = Math.abs(touchendY - touchstartY);
            
            // Só fazer swipe se o movimento horizontal for maior que o vertical
            if (horizontalDiff > verticalDiff && verticalDiff < this.maxVerticalDistance) {
                this.handleSwipeNavigation(touchstartX, touchendX);
            }
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
        let pullStartX = 0;
        let pullMoveY = 0;
        let pullMoveX = 0;
        let refreshTriggered = false;
        let canPull = false;
        let isPulling = false;
        const threshold = 120;
        const horizontalTolerance = 30; // Máximo movimento horizontal permitido

        const pullIndicator = document.createElement('div');
        pullIndicator.className = 'pull-to-refresh-indicator';
        pullIndicator.innerHTML = `
            <div class="pull-spinner"></div>
            <span class="pull-text">Puxe para atualizar</span>
        `;
        document.body.appendChild(pullIndicator);

        const resetPull = () => {
            canPull = false;
            isPulling = false;
            pullStartY = 0;
            pullStartX = 0;
            pullMoveY = 0;
            pullMoveX = 0;
            pullIndicator.style.transform = '';
            pullIndicator.style.opacity = '0';
            pullIndicator.classList.remove('ready');
        };

        document.addEventListener('touchstart', (e) => {
            // Verificações rigorosas para permitir pull
            if (window.scrollY !== 0) {
                resetPull();
                return;
            }

            const target = e.target;
            
            // Ignorar se está em modal, menu ou elementos interativos
            if (document.querySelector('.modal.active, .side-menu.active') ||
                target.closest('button, a, input, select, textarea, .pet-viewer, canvas')) {
                resetPull();
                return;
            }

            // Verificar elementos com scroll próprio
            const scrollableParent = target.closest('.tab-content, .modal-content, .scrollable');
            if (scrollableParent && scrollableParent.scrollTop > 0) {
                resetPull();
                return;
            }

            // Permitir pull apenas se todas as condições forem atendidas
            canPull = true;
            isPulling = false;
            pullStartY = e.touches[0].clientY;
            pullStartX = e.touches[0].clientX;
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (!canPull || refreshTriggered) {
                return;
            }

            const currentY = e.touches[0].clientY;
            const currentX = e.touches[0].clientX;
            pullMoveY = currentY - pullStartY;
            pullMoveX = Math.abs(currentX - pullStartX);

            // Se está rolando para cima ou muito na horizontal, cancela
            if (pullMoveY <= 0 || pullMoveX > horizontalTolerance) {
                resetPull();
                return;
            }

            // Se saiu do topo, cancela
            if (window.scrollY > 0) {
                resetPull();
                return;
            }

            // Só ativa pulling após movimento vertical significativo
            if (pullMoveY > 30 && pullMoveX < horizontalTolerance) {
                isPulling = true;
            }

            // Atualizar UI do indicador (sem preventDefault)
            if (isPulling && pullMoveY < 250) {
                const progress = Math.min(pullMoveY / threshold, 1);
                pullIndicator.style.transform = `translateY(${Math.min(pullMoveY, threshold)}px)`;
                pullIndicator.style.opacity = progress;
                
                if (progress >= 0.9) {
                    pullIndicator.classList.add('ready');
                    pullIndicator.querySelector('.pull-text').textContent = 'Solte para atualizar';
                } else {
                    pullIndicator.classList.remove('ready');
                    pullIndicator.querySelector('.pull-text').textContent = 'Puxe para atualizar';
                }
            }
        }, { passive: true }); // Mudado para passive: true

        document.addEventListener('touchend', () => {
            if (isPulling && pullMoveY >= threshold && !refreshTriggered && window.scrollY === 0) {
                refreshTriggered = true;
                pullIndicator.classList.add('refreshing');
                pullIndicator.querySelector('.pull-text').textContent = 'Atualizando...';
                
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }

                setTimeout(() => {
                    location.reload();
                }, 800);
            } else {
                resetPull();
            }
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
