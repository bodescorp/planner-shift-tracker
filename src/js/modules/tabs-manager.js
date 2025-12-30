// ========================================
// GERENCIADOR DE ABAS/PÁGINAS (MOBILE + DESKTOP)
// ========================================

import { createPetContent, ensurePetModelLoaded } from './pet-system.js';

export function initTabsManager() {
    // Selecionar botões de ambos os menus (mobile e desktop)
    const tabButtons = document.querySelectorAll('.tab-btn, .top-nav-btn');
    const mainContent = document.getElementById('mainContent');
    const meditationContent = createMeditationContent();
    const petContent = createPetContent();
    const notesContent = createNotesContent();

    // Anexar petContent ao DOM
    document.body.appendChild(petContent);

    // Controlar visibilidade das "páginas"
    function showPage(pageId) {
        const weekSelector = document.querySelector('.week-selector');
        const header = document.querySelector('header');
        
        // Esconder tudo primeiro
        mainContent.classList.add('hidden');
        meditationContent.style.display = 'none';
        petContent.style.display = 'none';
        notesContent.style.display = 'none';
        
        // Sempre esconder primeiro
        if (weekSelector) {
            weekSelector.style.display = 'none';
            weekSelector.classList.add('hidden');
        }
        if (header) {
            header.style.display = 'none';
            header.classList.add('hidden');
        }

        // Mostrar a página selecionada
        if (pageId === 'schedule') {
            mainContent.classList.remove('hidden');
            // Mostrar elementos do cronograma
            if (weekSelector) {
                weekSelector.style.display = 'flex';
                weekSelector.classList.remove('hidden');
            }
            if (header) {
                header.style.display = 'block';
                header.classList.remove('hidden');
            }
        } else {
            // Garantir que ficam escondidos em outras abas
            if (pageId === 'meditation') {
                meditationContent.style.display = 'block';
            } else if (pageId === 'pet') {
                petContent.style.display = 'block';
                setTimeout(() => ensurePetModelLoaded(), 100);
            } else if (pageId === 'notes') {
                notesContent.style.display = 'block';
            }
        }
    }

    // Event listeners dos botões de aba
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Remover active de todos os botões (mobile e desktop)
            document.querySelectorAll('.tab-btn, .top-nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            // Adicionar active em todos os botões correspondentes à mesma aba
            document.querySelectorAll(`[data-tab="${targetTab}"]`).forEach(btn => {
                btn.classList.add('active');
            });

            // Mostrar página correspondente
            showPage(targetTab);

            // Salvar aba ativa
            localStorage.setItem('activeTab', targetTab);
        });
    });

    // Carregar aba salva ou mostrar cronograma por padrão
    const savedTab = localStorage.getItem('activeTab') || 'schedule';
    
    // Garantir que a página seja mostrada corretamente após o carregamento
    setTimeout(() => {
        const savedTabButtons = document.querySelectorAll(`[data-tab="${savedTab}"]`);
        if (savedTabButtons.length > 0) {
            // Ativar visualmente os botões
            savedTabButtons.forEach(btn => btn.classList.add('active'));
            // Mostrar a página
            showPage(savedTab);
        } else {
            showPage('schedule');
        }
    }, 100);
}

// Criar conteúdo da página de meditação
function createMeditationContent() {
    const container = document.createElement('div');
    container.id = 'meditationPage';
    container.className = 'page-content meditation-page';
    container.style.display = 'none';
    container.innerHTML = `
        <div class="meditation-wrapper">
            <div class="meditation-header-section">
                <div class="meditation-icon-circle">🧘</div>
                <h1 class="meditation-title">Meditação</h1>
                <p class="meditation-subtitle">Pratique mindfulness com áudios guiados</p>
            </div>
            
            <div class="meditation-player-card">
                <div class="audio-info-section">
                    <div class="audio-emoji">🎵</div>
                    <div class="audio-text-wrapper">
                        <h2 class="audio-title" id="audioTitle">Carregando...</h2>
                        <p class="audio-description">Áudio do dia selecionado automaticamente</p>
                    </div>
                </div>
                
                <div class="progress-section">
                    <div class="progress-track">
                        <div class="progress-fill" id="progressBar"></div>
                    </div>
                    <div class="time-display-section">
                        <span class="time-current" id="timeCurrent">0:00</span>
                        <span class="time-separator">/</span>
                        <span class="time-total" id="timeTotal">0:00</span>
                    </div>
                </div>
                
                <div class="controls-section">
                    <button class="player-control-btn player-prev" id="prevBtn" aria-label="Anterior">
                        <span class="btn-icon">⏮️</span>
                    </button>
                    <button class="player-control-btn player-play" id="playBtn" aria-label="Play/Pause">
                        <span class="btn-icon">▶️</span>
                    </button>
                    <button class="player-control-btn player-next" id="nextBtn" aria-label="Próximo">
                        <span class="btn-icon">⏭️</span>
                    </button>
                </div>
                
                <div class="meditation-tips">
                    <div class="tip-item">
                        <span class="tip-icon">💡</span>
                        <span class="tip-text">Use fones de ouvido para melhor experiência</span>
                    </div>
                    <div class="tip-item">
                        <span class="tip-icon">🌙</span>
                        <span class="tip-text">Pratique em um ambiente calmo e silencioso</span>
                    </div>
                </div>
            </div>
            
            <audio id="meditationAudio" preload="metadata"></audio>
        </div>
    `;
    
    document.body.appendChild(container);
    return container;
}

// Criar conteúdo da página de notas
function createNotesContent() {
    const container = document.createElement('div');
    container.id = 'notesPage';
    container.className = 'page-content';
    container.style.display = 'none';
    container.innerHTML = `
        <div class="page-header">
            <h2>📝 Bloco de Notas</h2>
            <p class="page-subtitle">Suas anotações pessoais</p>
        </div>
        <div class="notes-container">
            <div class="notes-actions">
                <button class="save-note-btn" id="saveNoteBtn">💾 Salvar</button>
                <button class="clear-note-btn" id="clearNoteBtn">🗑️ Limpar Tudo</button>
            </div>
            <textarea 
                class="notes-textarea-large" 
                id="notesTextarea" 
                placeholder="Digite suas anotações aqui...

✨ Suas notas são salvas automaticamente a cada 2 segundos
📱 Sincronizadas no navegador
💡 Use para lembrar tarefas, ideias ou reflexões"></textarea>
            <div class="notes-footer">
                <span class="char-count" id="charCount">0 caracteres</span>
                <span class="last-saved" id="lastSaved"></span>
            </div>
        </div>
    `;
    
    document.body.appendChild(container);
    return container;
}