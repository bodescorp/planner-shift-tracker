/**
 * Módulo de Loading States
 * Gerencia estados de carregamento e skeleton screens
 */

export class LoadingManager {
    constructor() {
        this.activeLoaders = new Set();
    }

    /**
     * Mostra loading overlay global
     */
    showGlobalLoader(message = 'Carregando...') {
        let loader = document.getElementById('global-loader');
        
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'global-loader';
            loader.className = 'global-loader';
            loader.innerHTML = `
                <div class="loader-content">
                    <div class="loader-spinner"></div>
                    <p class="loader-message">${message}</p>
                </div>
            `;
            document.body.appendChild(loader);
        } else {
            loader.querySelector('.loader-message').textContent = message;
        }

        requestAnimationFrame(() => {
            loader.classList.add('active');
        });

        this.activeLoaders.add('global');
    }

    /**
     * Esconde loading overlay global
     */
    hideGlobalLoader() {
        const loader = document.getElementById('global-loader');
        if (loader) {
            loader.classList.remove('active');
            setTimeout(() => {
                if (!loader.classList.contains('active')) {
                    loader.remove();
                }
            }, 300);
        }
        this.activeLoaders.delete('global');
    }

    /**
     * Mostra skeleton screen em um elemento
     */
    showSkeleton(element, type = 'cards') {
        if (!element) return;

        const skeleton = document.createElement('div');
        skeleton.className = `skeleton skeleton-${type}`;
        skeleton.setAttribute('aria-busy', 'true');
        skeleton.setAttribute('aria-label', 'Carregando conteúdo');

        switch(type) {
            case 'cards':
                skeleton.innerHTML = `
                    <div class="skeleton-card"></div>
                    <div class="skeleton-card"></div>
                    <div class="skeleton-card"></div>
                `;
                break;
            case 'list':
                skeleton.innerHTML = `
                    <div class="skeleton-item"></div>
                    <div class="skeleton-item"></div>
                    <div class="skeleton-item"></div>
                    <div class="skeleton-item"></div>
                `;
                break;
            case 'text':
                skeleton.innerHTML = `
                    <div class="skeleton-text skeleton-text-full"></div>
                    <div class="skeleton-text skeleton-text-medium"></div>
                    <div class="skeleton-text skeleton-text-short"></div>
                `;
                break;
        }

        element.innerHTML = '';
        element.appendChild(skeleton);
    }

    /**
     * Remove skeleton e mostra conteúdo
     */
    hideSkeleton(element) {
        if (!element) return;
        
        const skeleton = element.querySelector('.skeleton');
        if (skeleton) {
            skeleton.classList.add('skeleton-fade-out');
            setTimeout(() => {
                skeleton.remove();
            }, 300);
        }
    }

    /**
     * Wrapper para async operations com loading
     */
    async withLoader(asyncFn, message = 'Processando...', useGlobal = false) {
        try {
            if (useGlobal) {
                this.showGlobalLoader(message);
            }
            
            const result = await asyncFn();
            
            if (useGlobal) {
                this.hideGlobalLoader();
            }
            
            return result;
        } catch (error) {
            if (useGlobal) {
                this.hideGlobalLoader();
            }
            throw error;
        }
    }

    /**
     * Cria um botão loading state
     */
    setButtonLoading(button, loading = true, originalText = null) {
        if (!button) return;

        if (loading) {
            button.dataset.originalText = originalText || button.textContent;
            button.disabled = true;
            button.classList.add('button-loading');
            button.innerHTML = `
                <span class="button-spinner"></span>
                <span>Processando...</span>
            `;
        } else {
            button.disabled = false;
            button.classList.remove('button-loading');
            button.textContent = button.dataset.originalText || originalText || 'Concluído';
            delete button.dataset.originalText;
        }
    }
}

// CSS para Loading States
const loadingStyles = `
/* Global Loader */
.global-loader {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10001;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
}

.global-loader.active {
    opacity: 1;
    pointer-events: auto;
}

.loader-content {
    text-align: center;
}

.loader-spinner {
    width: 48px;
    height: 48px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 16px;
}

.loader-message {
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.95rem;
    margin: 0;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Skeleton Screens */
.skeleton {
    width: 100%;
    animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-card,
.skeleton-item,
.skeleton-text {
    background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.03) 0%,
        rgba(255, 255, 255, 0.08) 50%,
        rgba(255, 255, 255, 0.03) 100%
    );
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s ease-in-out infinite;
    border-radius: 8px;
}

.skeleton-card {
    height: 200px;
    margin-bottom: 20px;
}

.skeleton-item {
    height: 60px;
    margin-bottom: 12px;
}

.skeleton-text {
    height: 16px;
    margin-bottom: 8px;
}

.skeleton-text-full {
    width: 100%;
}

.skeleton-text-medium {
    width: 70%;
}

.skeleton-text-short {
    width: 40%;
}

.skeleton-fade-out {
    animation: fade-out 0.3s ease forwards;
}

@keyframes skeleton-shimmer {
    0% {
        background-position: -200% 0;
    }
    100% {
        background-position: 200% 0;
    }
}

@keyframes skeleton-pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.6;
    }
}

@keyframes fade-out {
    to {
        opacity: 0;
        transform: scale(0.95);
    }
}

/* Button Loading State */
.button-loading {
    position: relative;
    color: transparent !important;
    pointer-events: none;
}

.button-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
    .loader-spinner,
    .button-spinner {
        animation: none;
        border-color: rgba(255, 255, 255, 0.8);
    }
    
    .skeleton-card,
    .skeleton-item,
    .skeleton-text {
        animation: skeleton-pulse 3s ease-in-out infinite;
    }
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = loadingStyles;
document.head.appendChild(styleSheet);

// Singleton instance
let loadingInstance = null;

export function getLoadingManager() {
    if (!loadingInstance) {
        loadingInstance = new LoadingManager();
    }
    return loadingInstance;
}

export default LoadingManager;
