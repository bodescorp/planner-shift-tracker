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
        const threshold = 100;
        const horizontalTolerance = 30;

        // Sem indicador visual - pull-to-refresh discreto

        const resetPull = () => {
            canPull = false;
            isPulling = false;
            pullStartY = 0;
            pullStartX = 0;
            pullMoveY = 0;
            pullMoveX = 0;
        };

        document.addEventListener('touchstart', (e) => {
            // Resetar flag de refresh em novo touch
            if (refreshTriggered) {
                refreshTriggered = false;
            }

            const target = e.target;
            
            // Ignorar elementos interativos
            if (document.querySelector('.modal.active, .side-menu.active') ||
                target.closest('button, a, input, select, textarea, .pet-viewer, canvas')) {
                return;
            }

            // Verificar scroll da janela
            if (window.scrollY !== 0) {
                return;
            }

            // Verificar scroll interno de containers com overflow
            const scrollableParent = target.closest('.page-content, .tab-content, .modal-content, .scrollable');
            if (scrollableParent && scrollableParent.scrollTop > 0) {
                return;
            }

            canPull = true;
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

            // Verificar scroll do container
            const scrollableParent = e.target.closest('.page-content, .tab-content, .modal-content, .scrollable');
            
            // Cancelar se movimento errado ou não está no topo
            if (pullMoveY <= 0 || pullMoveX > horizontalTolerance || window.scrollY > 0 || 
                (scrollableParent && scrollableParent.scrollTop > 0)) {
                resetPull();
                return;
            }

            // Ativar pulling
            if (pullMoveY > 20 && pullMoveX < horizontalTolerance) {
                isPulling = true;
            }

            // Sem feedback visual - apenas detectar movimento
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (!isPulling || refreshTriggered) {
                resetPull();
                return;
            }

            // Verificar scroll do container
            const scrollableParent = e.target.closest('.page-content, .tab-content, .modal-content, .scrollable');
            const windowAtTop = window.scrollY === 0;
            const containerAtTop = !scrollableParent || scrollableParent.scrollTop === 0;
            const isAtTop = windowAtTop && containerAtTop;

            // Verificar se atingiu o threshold e está no topo
            if (pullMoveY >= threshold && isAtTop) {
                refreshTriggered = true;
                
                // Feedback tátil
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }

                // Reload imediato
                setTimeout(() => {
                    window.location.reload();
                }, 150);
            } else {
                resetPull();
            }
        }, { passive: true });
    }
}

// CSS para Swipe Gestures  
const swipeStyles = `
/* Pull-to-refresh sem indicador visual - removido */
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = swipeStyles;
document.head.appendChild(styleSheet);

export default SwipeGestures;
