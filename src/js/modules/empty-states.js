/**
 * Módulo de Empty States
 * Mostra estados vazios ilustrados
 */

export class EmptyStates {
    constructor() {
        this.init();
    }

    init() {
        this.checkEmptyStates();
        this.setupObserver();
    }

    setupObserver() {
        // Observer para detectar mudanças e verificar estados vazios
        const observer = new MutationObserver(() => {
            this.checkEmptyStates();
        });

        const containers = document.querySelectorAll('.days-container, .notes-container, .meditation-container');
        containers.forEach(container => {
            observer.observe(container, {
                childList: true,
                subtree: true
            });
        });
    }

    checkEmptyStates() {
        this.checkActivities();
        this.checkNotes();
    }

    checkActivities() {
        const weekContents = document.querySelectorAll('.week-content.active');
        
        weekContents.forEach(weekContent => {
            const dayCards = weekContent.querySelectorAll('.day-card');
            let hasActivities = false;

            dayCards.forEach(card => {
                const activities = card.querySelectorAll('.activity');
                if (activities.length > 0) {
                    hasActivities = true;
                }
            });

            // Se não houver atividades, mostrar empty state
            if (!hasActivities && !weekContent.querySelector('.empty-state')) {
                this.showEmptyState(weekContent, 'activities');
            }
        });
    }

    checkNotes() {
        const notesTextarea = document.getElementById('notes-textarea');
        if (!notesTextarea) return;

        const notesValue = notesTextarea.value.trim();
        const notesContainer = notesTextarea.closest('.notes-container');

        if (!notesValue && !notesContainer.querySelector('.empty-state-notes')) {
            this.showEmptyState(notesContainer, 'notes');
        } else if (notesValue) {
            const emptyState = notesContainer.querySelector('.empty-state-notes');
            if (emptyState) emptyState.remove();
        }
    }

    showEmptyState(container, type) {
        const emptyState = document.createElement('div');
        emptyState.className = `empty-state empty-state-${type}`;
        
        const illustrations = {
            activities: {
                emoji: '📅',
                title: 'Nenhuma atividade programada',
                description: 'Adicione atividades para organizar sua semana',
                action: null
            },
            notes: {
                emoji: '📝',
                title: 'Comece a escrever',
                description: 'Use este espaço para suas anotações e ideias',
                action: null
            },
            search: {
                emoji: '🔍',
                title: 'Nenhum resultado encontrado',
                description: 'Tente usar outras palavras-chave',
                action: 'Limpar busca'
            }
        };

        const config = illustrations[type];
        
        emptyState.innerHTML = `
            <div class="empty-state-content">
                <div class="empty-state-emoji">${config.emoji}</div>
                <h3 class="empty-state-title">${config.title}</h3>
                <p class="empty-state-description">${config.description}</p>
                ${config.action ? `<button class="empty-state-action">${config.action}</button>` : ''}
            </div>
        `;

        container.appendChild(emptyState);

        // Event listener para action
        const actionBtn = emptyState.querySelector('.empty-state-action');
        if (actionBtn && type === 'search') {
            actionBtn.addEventListener('click', () => {
                const searchInput = document.getElementById('activity-search');
                if (searchInput) {
                    searchInput.value = '';
                    searchInput.dispatchEvent(new Event('input'));
                }
            });
        }
    }

    static createSearchEmptyState() {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state empty-state-search';
        emptyState.innerHTML = `
            <div class="empty-state-content">
                <div class="empty-state-emoji">🔍</div>
                <h3 class="empty-state-title">Nenhum resultado encontrado</h3>
                <p class="empty-state-description">Tente usar palavras-chave diferentes</p>
            </div>
        `;
        return emptyState;
    }
}

// CSS para Empty States
const emptyStateStyles = `
.empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    padding: 40px 20px;
    text-align: center;
    animation: fadeInUp 0.5s ease;
}

.empty-state-content {
    max-width: 400px;
}

.empty-state-emoji {
    font-size: 4rem;
    margin-bottom: 20px;
    opacity: 0.3;
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

.empty-state-title {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.2rem;
    font-weight: 300;
    margin-bottom: 12px;
}

.empty-state-description {
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.9rem;
    font-weight: 300;
    line-height: 1.6;
    margin-bottom: 24px;
}

.empty-state-action {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 8px;
    padding: 10px 20px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    font-weight: 300;
    cursor: pointer;
    transition: all 0.2s;
}

.empty-state-action:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.18);
    color: rgba(255, 255, 255, 0.95);
}

@media (prefers-reduced-motion: reduce) {
    .empty-state {
        animation: none;
    }
    
    .empty-state-emoji {
        animation: none;
    }
}

@media (max-width: 768px) {
    .empty-state {
        min-height: 250px;
        padding: 30px 15px;
    }
    
    .empty-state-emoji {
        font-size: 3rem;
    }
    
    .empty-state-title {
        font-size: 1.1rem;
    }
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = emptyStateStyles;
document.head.appendChild(styleSheet);

export default EmptyStates;
