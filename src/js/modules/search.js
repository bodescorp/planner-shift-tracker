/**
 * Módulo de Busca e Filtro
 * Permite buscar e filtrar atividades
 */

export class SearchManager {
    constructor() {
        this.searchInput = null;
        this.init();
    }

    init() {
        this.createSearchBar();
        this.setupEventListeners();
    }

    createSearchBar() {
        const container = document.querySelector('.container');
        if (!container) return;

        // Verificar se já existe para evitar duplicatas
        if (document.querySelector('.search-bar')) return;

        const searchBar = document.createElement('div');
        searchBar.className = 'search-bar';
        searchBar.innerHTML = `
            <div class="search-wrapper">
                <span class="search-icon">🔍</span>
                <input 
                    type="search" 
                    id="activity-search" 
                    class="search-input"
                    placeholder="Buscar atividades... (Ctrl+K)"
                    aria-label="Buscar atividades"
                    autocomplete="off"
                />
                <button class="search-clear" aria-label="Limpar busca" style="display: none;">
                    ×
                </button>
            </div>
            <div class="search-results-count" style="display: none;"></div>
        `;

        // Adicionar diretamente ao main-content ao invés de após o header
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            const firstChild = mainContent.firstChild;
            if (firstChild) {
                mainContent.insertBefore(searchBar, firstChild);
            } else {
                mainContent.appendChild(searchBar);
            }
        }

        this.searchInput = document.getElementById('activity-search');
    }

    setupEventListeners() {
        if (!this.searchInput) return;

        const clearBtn = document.querySelector('.search-clear');
        const resultsCount = document.querySelector('.search-results-count');

        // Input de busca
        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            if (query) {
                clearBtn.style.display = 'flex';
                this.performSearch(query);
            } else {
                clearBtn.style.display = 'none';
                resultsCount.style.display = 'none';
                this.clearSearch();
            }
        });

        // Botão limpar
        clearBtn.addEventListener('click', () => {
            this.searchInput.value = '';
            clearBtn.style.display = 'none';
            resultsCount.style.display = 'none';
            this.clearSearch();
            this.searchInput.focus();
        });

        // Atalho Ctrl+K ou Cmd+K
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.searchInput.focus();
                this.searchInput.select();
            }

            // ESC para limpar busca
            if (e.key === 'Escape' && document.activeElement === this.searchInput) {
                this.searchInput.value = '';
                clearBtn.style.display = 'none';
                resultsCount.style.display = 'none';
                this.clearSearch();
                this.searchInput.blur();
            }
        });
    }

    performSearch(query) {
        const activities = document.querySelectorAll('.activity');
        const dayCards = document.querySelectorAll('.day-card');
        const resultsCount = document.querySelector('.search-results-count');
        let matchCount = 0;
        let totalActivities = activities.length;

        // Buscar em todas as atividades
        activities.forEach(activity => {
            const desc = activity.querySelector('.desc')?.textContent.toLowerCase() || '';
            const time = activity.querySelector('.time')?.textContent.toLowerCase() || '';
            const searchText = `${desc} ${time}`;

            if (searchText.includes(query)) {
                activity.classList.remove('search-hidden');
                activity.classList.add('search-match');
                matchCount++;
            } else {
                activity.classList.add('search-hidden');
                activity.classList.remove('search-match');
            }
        });

        // Esconder cards vazios
        dayCards.forEach(card => {
            const visibleActivities = card.querySelectorAll('.activity:not(.search-hidden)');
            if (visibleActivities.length === 0) {
                card.classList.add('search-hidden');
            } else {
                card.classList.remove('search-hidden');
            }
        });

        // Mostrar contador de resultados
        resultsCount.style.display = 'block';
        if (matchCount === 0) {
            resultsCount.innerHTML = `
                <span class="no-results">
                    Nenhuma atividade encontrada para "${query}"
                </span>
            `;
        } else {
            resultsCount.innerHTML = `
                <span class="results-info">
                    ${matchCount} de ${totalActivities} atividade${matchCount !== 1 ? 's' : ''}
                </span>
            `;
        }
    }

    clearSearch() {
        const activities = document.querySelectorAll('.activity');
        const dayCards = document.querySelectorAll('.day-card');

        activities.forEach(activity => {
            activity.classList.remove('search-hidden', 'search-match');
        });

        dayCards.forEach(card => {
            card.classList.remove('search-hidden');
        });
    }
}

// CSS para Search Bar
const searchStyles = `
.search-bar {
    margin-bottom: 32px;
    animation: fadeInUp 0.4s ease;
}

/* Esconder search-bar nas páginas de Meditação e Mascote */
.pet-page .search-bar,
.meditation-page .search-bar,
#petPage .search-bar,
#meditationPage .search-bar {
    display: none !important;
}

/* Garantir que não seja exibida quando main-content está oculto */
.main-content.hidden ~ .search-bar,
.page-content:not(.main-content) .search-bar {
    display: none !important;
}

@media (min-width: 769px) {
    .search-bar {
        margin-bottom: 40px;
    }
}

.search-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 0 16px;
    transition: all 0.3s ease;
}

.search-wrapper:focus-within {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.05);
}

.search-icon {
    font-size: 1.1rem;
    opacity: 0.4;
    margin-right: 12px;
    flex-shrink: 0;
}

.search-input {
    flex: 1;
    background: none;
    border: none;
    padding: 14px 0;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.95rem;
    font-weight: 300;
    outline: none;
}

.search-input::placeholder {
    color: rgba(255, 255, 255, 0.3);
}

.search-input::-webkit-search-cancel-button {
    display: none;
}

.search-clear {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.4);
    font-size: 1.8rem;
    cursor: pointer;
    padding: 0;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;
    flex-shrink: 0;
    line-height: 1;
}

.search-clear:hover {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.8);
}

.search-results-count {
    margin-top: 12px;
    text-align: center;
    font-size: 0.85rem;
}

.results-info {
    color: rgba(255, 255, 255, 0.5);
    font-weight: 300;
}

.no-results {
    color: rgba(255, 255, 255, 0.4);
    font-weight: 300;
    font-style: italic;
}

/* Estilo para itens escondidos/destacados */
.search-hidden {
    display: none !important;
}

.search-match {
    animation: highlightPulse 0.5s ease;
}

@keyframes highlightPulse {
    0%, 100% {
        background: transparent;
    }
    50% {
        background: rgba(255, 255, 255, 0.05);
    }
}

@media (prefers-reduced-motion: reduce) {
    .search-bar,
    .search-match {
        animation: none;
    }
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = searchStyles;
document.head.appendChild(styleSheet);

export default SearchManager;
