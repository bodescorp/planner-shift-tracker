/**
 * Módulo de Acessibilidade
 * Gerencia recursos de acessibilidade do sistema
 */

export class Accessibility {
    constructor() {
        this.init();
    }

    init() {
        this.setupSkipLinks();
        this.setupKeyboardNavigation();
        this.announcePageChanges();
    }

    /**
     * Skip links para navegação por teclado
     */
    setupSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Pular para o conteúdo principal';
        skipLink.setAttribute('aria-label', 'Pular para o conteúdo principal');
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    /**
     * Atalhos de teclado
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Alt + M = Menu
            if (e.altKey && e.key === 'm') {
                e.preventDefault();
                const menuToggle = document.getElementById('menuToggle');
                if (menuToggle) menuToggle.click();
            }

            // Alt + 1-4 = Navegar entre abas
            if (e.altKey && ['1', '2', '3', '4'].includes(e.key)) {
                e.preventDefault();
                const tabIndex = parseInt(e.key) - 1;
                const tabs = document.querySelectorAll('.tab-btn, .top-nav-btn');
                if (tabs[tabIndex]) tabs[tabIndex].click();
            }

            // ESC = Fechar modais/menus
            if (e.key === 'Escape') {
                const sideMenu = document.getElementById('sideMenu');
                const modals = document.querySelectorAll('.modal.active');
                
                if (sideMenu && sideMenu.classList.contains('active')) {
                    document.getElementById('menuClose')?.click();
                } else if (modals.length > 0) {
                    modals[modals.length - 1].querySelector('.modal-close')?.click();
                }
            }

            // Ctrl/Cmd + K = Busca rápida (a ser implementado)
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                // Implementar busca rápida no futuro
                console.log('Busca rápida');
            }
        });
    }

    /**
     * Anuncia mudanças de página para leitores de tela
     */
    announcePageChanges() {
        const announcer = document.createElement('div');
        announcer.setAttribute('role', 'status');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        document.body.appendChild(announcer);

        // Observer para mudanças de conteúdo
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.target.classList.contains('main-content')) {
                    const activeTab = document.querySelector('.tab-btn.active, .top-nav-btn.active');
                    if (activeTab) {
                        const tabName = activeTab.querySelector('.tab-label')?.textContent || 
                                      activeTab.textContent.trim();
                        announcer.textContent = `Navegou para ${tabName}`;
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Announce para leitores de tela
     */
    static announce(message, priority = 'polite') {
        const announcer = document.querySelector('[role="status"]') || 
                         document.querySelector('[aria-live]');
        if (announcer) {
            announcer.setAttribute('aria-live', priority);
            announcer.textContent = message;
            setTimeout(() => {
                announcer.textContent = '';
            }, 1000);
        }
    }
}

// CSS para skip link e screen reader only
const accessibilityStyles = `
.skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--text-primary);
    color: var(--bg-primary);
    padding: 8px 16px;
    text-decoration: none;
    font-weight: 500;
    z-index: 10000;
    border-radius: 0 0 4px 0;
}

.skip-link:focus {
    top: 0;
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = accessibilityStyles;
document.head.appendChild(styleSheet);

export default Accessibility;
