/**
 * Módulo de Toast Notifications
 * Substitui alerts nativos por notificações elegantes
 */

export class Toast {
    constructor() {
        this.container = this.createContainer();
        this.queue = [];
    }

    createContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        container.setAttribute('aria-live', 'polite');
        container.setAttribute('aria-atomic', 'true');
        document.body.appendChild(container);
        return container;
    }

    /**
     * Mostra uma notificação toast
     * @param {string} message - Mensagem a ser exibida
     * @param {string} type - Tipo: 'success', 'error', 'warning', 'info'
     * @param {number} duration - Duração em ms (padrão: 3000)
     */
    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');
        
        const icon = this.getIcon(type);
        const closeBtn = document.createElement('button');
        closeBtn.className = 'toast-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Fechar notificação');
        closeBtn.onclick = () => this.hide(toast);

        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        `;
        toast.appendChild(closeBtn);

        this.container.appendChild(toast);

        // Haptic feedback em mobile
        if (navigator.vibrate) {
            navigator.vibrate(type === 'error' ? [50, 100, 50] : 50);
        }

        // Animação de entrada
        requestAnimationFrame(() => {
            toast.classList.add('toast-show');
        });

        // Auto-hide
        if (duration > 0) {
            setTimeout(() => this.hide(toast), duration);
        }

        return toast;
    }

    hide(toast) {
        toast.classList.remove('toast-show');
        toast.classList.add('toast-hide');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    getIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    // Atalhos
    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }
}

// CSS para Toast
const toastStyles = `
.toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 12px;
    pointer-events: none;
}

@media (max-width: 768px) {
    .toast-container {
        top: 10px;
        right: 10px;
        left: 10px;
    }
}

.toast {
    background: rgba(20, 20, 20, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 280px;
    max-width: 400px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    pointer-events: auto;
    opacity: 0;
    transform: translateX(400px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (max-width: 768px) {
    .toast {
        min-width: auto;
        width: 100%;
        max-width: none;
    }
}

.toast-show {
    opacity: 1;
    transform: translateX(0);
}

.toast-hide {
    opacity: 0;
    transform: translateX(400px);
}

.toast-icon {
    font-size: 1.3rem;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.toast-success {
    border-left: 3px solid rgba(16, 185, 129, 0.8);
}

.toast-success .toast-icon {
    color: rgba(16, 185, 129, 1);
    background: rgba(16, 185, 129, 0.15);
}

.toast-error {
    border-left: 3px solid rgba(239, 68, 68, 0.8);
}

.toast-error .toast-icon {
    color: rgba(239, 68, 68, 1);
    background: rgba(239, 68, 68, 0.15);
}

.toast-warning {
    border-left: 3px solid rgba(245, 158, 11, 0.8);
}

.toast-warning .toast-icon {
    color: rgba(245, 158, 11, 1);
    background: rgba(245, 158, 11, 0.15);
}

.toast-info {
    border-left: 3px solid rgba(59, 130, 246, 0.8);
}

.toast-info .toast-icon {
    color: rgba(59, 130, 246, 1);
    background: rgba(59, 130, 246, 0.15);
}

.toast-message {
    flex: 1;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.9rem;
    line-height: 1.4;
}

.toast-close {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s;
    flex-shrink: 0;
}

.toast-close:hover {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.9);
}

@media (prefers-reduced-motion: reduce) {
    .toast {
        transition: opacity 0.1s;
        transform: none !important;
    }
    
    .toast-show {
        opacity: 1;
    }
    
    .toast-hide {
        opacity: 0;
    }
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = toastStyles;
document.head.appendChild(styleSheet);

// Singleton instance
let toastInstance = null;

export function getToast() {
    if (!toastInstance) {
        toastInstance = new Toast();
    }
    return toastInstance;
}

export default Toast;
