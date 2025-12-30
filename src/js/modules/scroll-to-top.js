/**
 * Módulo de Scroll to Top
 * Botão para voltar ao topo da página
 */

export class ScrollToTop {
    constructor() {
        this.button = null;
        this.init();
    }

    init() {
        this.createButton();
        this.setupEventListeners();
    }

    createButton() {
        this.button = document.createElement('button');
        this.button.className = 'scroll-to-top';
        this.button.innerHTML = '↑';
        this.button.setAttribute('aria-label', 'Voltar ao topo');
        this.button.setAttribute('title', 'Voltar ao topo');
        document.body.appendChild(this.button);
    }

    setupEventListeners() {
        // Mostrar/esconder baseado no scroll
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 300) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }

            lastScroll = currentScroll;
        }, { passive: true });

        // Scroll suave ao clicar
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(30);
            }
        });
    }
}

// CSS para Scroll to Top
const scrollStyles = `
.scroll-to-top {
    position: fixed;
    bottom: calc(80px + var(--safe-area-bottom, 0px));
    right: 20px;
    width: 48px;
    height: 48px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 50%;
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transform: scale(0.8);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 999;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.scroll-to-top.visible {
    opacity: 1;
    visibility: visible;
    transform: scale(1);
}

.scroll-to-top:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
}

.scroll-to-top:active {
    transform: scale(0.95);
}

@media (min-width: 769px) {
    .scroll-to-top {
        bottom: 40px;
        right: 40px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .scroll-to-top {
        transition: opacity 0.2s;
        transform: none !important;
    }
    
    .scroll-to-top.visible {
        transform: none;
    }
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = scrollStyles;
document.head.appendChild(styleSheet);

export default ScrollToTop;
