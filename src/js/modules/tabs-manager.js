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
    container.className = 'page-content';
    container.style.display = 'none';
    container.innerHTML = `
        <div class="page-header">
            <h2>🧘 Meditação</h2>
            <p class="page-subtitle">Pratique mindfulness com nossos áudios guiados</p>
        </div>
        <div class="meditation-container">
            <div class="audio-card">
                <div class="audio-info-display">
                    <span class="audio-title-large" id="audioTitle">Carregando...</span>
                    <span class="audio-desc">Áudio do dia selecionado automaticamente</span>
                </div>
                <div class="progress-container-large">
                    <div class="progress-bar" id="progressBar"></div>
                    <span class="time-display" id="timeDisplay">0:00 / 0:00</span>
                </div>
                <div class="player-buttons-large">
                    <button class="control-btn" id="prevBtn" aria-label="Anterior">⏮️</button>
                    <button class="control-btn play-btn" id="playBtn" aria-label="Play/Pause">▶️</button>
                    <button class="control-btn" id="nextBtn" aria-label="Próximo">⏭️</button>
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