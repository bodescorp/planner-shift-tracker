// ========================================
// GERENCIADOR DE ABAS/PÁGINAS (MOBILE)
// ========================================

export function initTabsManager() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const mainContent = document.getElementById('mainContent');
    const meditationContent = createMeditationContent();
    const notesContent = createNotesContent();

    // Controlar visibilidade das "páginas"
    function showPage(pageId) {
        // Esconder tudo primeiro
        mainContent.classList.add('hidden');
        meditationContent.style.display = 'none';
        notesContent.style.display = 'none';

        // Mostrar a página selecionada
        if (pageId === 'schedule') {
            mainContent.classList.remove('hidden');
        } else if (pageId === 'meditation') {
            meditationContent.style.display = 'block';
        } else if (pageId === 'notes') {
            notesContent.style.display = 'block';
        }
    }

    // Event listeners dos botões de aba
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Remover active de todos
            tabButtons.forEach(btn => btn.classList.remove('active'));

            // Adicionar active no clicado
            button.classList.add('active');

            // Mostrar página correspondente
            showPage(targetTab);

            // Salvar aba ativa
            localStorage.setItem('activeTab', targetTab);
        });
    });

    // Carregar aba salva ou mostrar cronograma por padrão
    const savedTab = localStorage.getItem('activeTab') || 'schedule';
    const activeButton = document.querySelector(`[data-tab="${savedTab}"]`);
    if (activeButton) {
        activeButton.click();
    } else {
        showPage('schedule');
    }

    console.log('✅ Sistema de abas/páginas inicializado');
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