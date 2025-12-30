/**
 * Módulo de Tooltips
 * Tooltips explicativos para elementos
 */

export class TooltipManager {
    constructor() {
        this.tooltip = null;
        this.init();
    }

    init() {
        this.createTooltip();
        this.setupObserver();
        this.addTooltips();
    }

    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'tooltip';
        this.tooltip.setAttribute('role', 'tooltip');
        document.body.appendChild(this.tooltip);
    }

    setupObserver() {
        // Observer para elementos com data-tooltip
        const observer = new MutationObserver(() => {
            this.addTooltips();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    addTooltips() {
        const elements = document.querySelectorAll('[data-tooltip]:not([data-tooltip-init])');
        
        elements.forEach(element => {
            element.setAttribute('data-tooltip-init', 'true');
            
            element.addEventListener('mouseenter', (e) => {
                this.show(e.target);
            });

            element.addEventListener('mouseleave', () => {
                this.hide();
            });

            element.addEventListener('focus', (e) => {
                this.show(e.target);
            });

            element.addEventListener('blur', () => {
                this.hide();
            });
        });

        // Adicionar tooltips em elementos específicos
        this.addDefaultTooltips();
    }

    addDefaultTooltips() {
        // Menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle && !menuToggle.getAttribute('data-tooltip')) {
            menuToggle.setAttribute('data-tooltip', 'Menu (Alt+M)');
        }

        // Week selector buttons
        document.querySelectorAll('.week-btn').forEach(btn => {
            if (!btn.getAttribute('data-tooltip')) {
                const week = btn.textContent.includes('A') ? 'A' : 'B';
                btn.setAttribute('data-tooltip', `Alternar para Semana ${week}`);
            }
        });

        // Tab buttons
        const tabs = [
            { selector: '.tab-btn[data-page="schedule"]', text: 'Cronograma (Alt+1)' },
            { selector: '.tab-btn[data-page="meditation"]', text: 'Meditação (Alt+2)' },
            { selector: '.tab-btn[data-page="pet"]', text: 'Mascote (Alt+3)' },
            { selector: '.tab-btn[data-page="notes"]', text: 'Notas (Alt+4)' }
        ];

        tabs.forEach(({ selector, text }) => {
            const tab = document.querySelector(selector);
            if (tab && !tab.getAttribute('data-tooltip')) {
                tab.setAttribute('data-tooltip', text);
            }
        });
    }

    show(element) {
        const text = element.getAttribute('data-tooltip');
        if (!text) return;

        this.tooltip.textContent = text;
        this.tooltip.classList.add('tooltip-visible');

        // Posicionar tooltip
        requestAnimationFrame(() => {
            const rect = element.getBoundingClientRect();
            const tooltipRect = this.tooltip.getBoundingClientRect();
            
            let top = rect.top - tooltipRect.height - 8;
            let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

            // Ajustar se sair da tela
            if (top < 0) {
                top = rect.bottom + 8;
            }
            if (left < 10) {
                left = 10;
            }
            if (left + tooltipRect.width > window.innerWidth - 10) {
                left = window.innerWidth - tooltipRect.width - 10;
            }

            this.tooltip.style.top = `${top}px`;
            this.tooltip.style.left = `${left}px`;
        });
    }

    hide() {
        this.tooltip.classList.remove('tooltip-visible');
    }
}

// CSS para Tooltips
const tooltipStyles = `
.tooltip {
    position: fixed;
    background: rgba(20, 20, 20, 0.95);
    color: rgba(255, 255, 255, 0.95);
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 300;
    pointer-events: none;
    z-index: 10002;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease, visibility 0.2s ease;
    white-space: nowrap;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.tooltip-visible {
    opacity: 1;
    visibility: visible;
}

.tooltip::before {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 8px;
    background: rgba(20, 20, 20, 0.95);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    transform: translateX(-50%) rotate(45deg);
}

@media (prefers-reduced-motion: reduce) {
    .tooltip {
        transition: none;
    }
}

@media (max-width: 768px) {
    .tooltip {
        display: none;
    }
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = tooltipStyles;
document.head.appendChild(styleSheet);

export default TooltipManager;
