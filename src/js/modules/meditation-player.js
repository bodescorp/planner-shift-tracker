// ========================================
// PLAYER DE MEDITAÇÃO E BLOCO DE NOTAS
// ========================================

const AUDIO_COUNT = 8;
const AUDIO_BASE_PATH = 'meditação/';

export function initMeditationPlayer() {
    // Aguardar um pouco para garantir que as páginas foram criadas
    setTimeout(() => {
        initPlayer();
        initNotes();
    }, 100);
}

// ========================================
// PLAYER DE MEDITAÇÃO
// ========================================
function initPlayer() {
    const audio = document.getElementById('meditationAudio');
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const audioTitle = document.getElementById('audioTitle');
    const progressBar = document.getElementById('progressBar');
    const timeDisplay = document.getElementById('timeDisplay');

    if (!audio) {
        return;
    }

    // Determinar qual áudio tocar baseado no dia
    function getAudioForToday() {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
        return (dayOfYear % AUDIO_COUNT) + 1;
    }

    let currentAudio = getAudioForToday();
    let isPlaying = false;

    // Carregar áudio
    function loadAudio(audioNumber) {
        currentAudio = audioNumber;
        audio.src = `${AUDIO_BASE_PATH}${audioNumber}.mp3`;
        if (audioTitle) audioTitle.textContent = `Áudio ${audioNumber} de ${AUDIO_COUNT}`;
        
        // Atualizar ambos os títulos se existirem
        const audioTitleLarge = document.querySelector('.audio-title-large');
        if (audioTitleLarge) audioTitleLarge.textContent = `Áudio ${audioNumber} de ${AUDIO_COUNT}`;
        
        localStorage.setItem('lastMeditationAudio', audioNumber);
    }

    // Toggle play/pause
    function togglePlay() {
        if (isPlaying) {
            audio.pause();
            playBtn.textContent = '▶️';
            isPlaying = false;
        } else {
            audio.play();
            playBtn.textContent = '⏸️';
            isPlaying = true;
        }
    }

    // Navegar para áudio anterior
    function playPrevious() {
        currentAudio = currentAudio === 1 ? AUDIO_COUNT : currentAudio - 1;
        loadAudio(currentAudio);
        if (isPlaying) {
            audio.play();
        }
    }

    // Navegar para próximo áudio
    function playNext() {
        currentAudio = currentAudio === AUDIO_COUNT ? 1 : currentAudio + 1;
        loadAudio(currentAudio);
        if (isPlaying) {
            audio.play();
        }
    }

    // Formatar tempo
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Atualizar progresso
    function updateProgress() {
        if (audio.duration) {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.style.setProperty('--progress', `${progress}%`);
            if (timeDisplay) timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
        }
    }

    // Event listeners
    playBtn?.addEventListener('click', togglePlay);
    prevBtn?.addEventListener('click', playPrevious);
    nextBtn?.addEventListener('click', playNext);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);
    
    audio.addEventListener('ended', () => {
        playBtn.textContent = '▶️';
        isPlaying = false;
        playNext();
    });

    audio.addEventListener('play', () => {
        playBtn.textContent = '⏸️';
        isPlaying = true;
    });

    audio.addEventListener('pause', () => {
        playBtn.textContent = '▶️';
        isPlaying = false;
    });

    audio.addEventListener('error', (e) => {
        if (audioTitle) audioTitle.textContent = `Erro ao carregar áudio ${currentAudio}`;
    });

    // Carregar último áudio tocado ou áudio do dia
    const lastAudio = localStorage.getItem('lastMeditationAudio');
    const audioToLoad = lastAudio ? parseInt(lastAudio) : getAudioForToday();
    loadAudio(audioToLoad);

}

// ========================================
// BLOCO DE NOTAS
// ========================================
function initNotes() {
    const notesTextarea = document.getElementById('notesTextarea');
    const saveNoteBtn = document.getElementById('saveNoteBtn');
    const clearNoteBtn = document.getElementById('clearNoteBtn');
    const charCount = document.getElementById('charCount');
    const lastSaved = document.getElementById('lastSaved');

    if (!notesTextarea) {
        return;
    }

    // Carregar notas salvas
    function loadNotes() {
        const savedNotes = localStorage.getItem('userNotes') || '';
        notesTextarea.value = savedNotes;
        updateCharCount();
        
        const lastSaveTime = localStorage.getItem('notesSavedAt');
        if (lastSaveTime && lastSaved) {
            const date = new Date(lastSaveTime);
            lastSaved.textContent = `Salvo: ${date.toLocaleString('pt-BR', { 
                day: '2-digit', 
                month: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit' 
            })}`;
        }
    }

    // Salvar notas
    function saveNotes() {
        const notes = notesTextarea.value;
        const now = new Date().toISOString();
        localStorage.setItem('userNotes', notes);
        localStorage.setItem('notesSavedAt', now);
        
        // Feedback visual
        if (saveNoteBtn) {
            saveNoteBtn.textContent = '✅ Salvo!';
            setTimeout(() => {
                saveNoteBtn.textContent = '💾 Salvar';
            }, 2000);
        }
        
        if (lastSaved) {
            const date = new Date(now);
            lastSaved.textContent = `Salvo: ${date.toLocaleString('pt-BR', { 
                day: '2-digit', 
                month: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit' 
            })}`;
        }
        
    }

    // Auto-salvar ao digitar (com debounce)
    let autoSaveTimeout;
    function autoSave() {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
            saveNotes();
        }, 2000);
    }

    // Limpar notas
    function clearNotes() {
        if (confirm('🗑️ Tem certeza que deseja limpar todas as anotações?')) {
            notesTextarea.value = '';
            localStorage.removeItem('userNotes');
            localStorage.removeItem('notesSavedAt');
            updateCharCount();
            if (lastSaved) lastSaved.textContent = '';
        }
    }

    // Atualizar contador de caracteres
    function updateCharCount() {
        const count = notesTextarea.value.length;
        if (charCount) charCount.textContent = `${count} caractere${count !== 1 ? 's' : ''}`;
    }

    // Event listeners
    saveNoteBtn?.addEventListener('click', saveNotes);
    clearNoteBtn?.addEventListener('click', clearNotes);
    notesTextarea?.addEventListener('input', () => {
        updateCharCount();
        autoSave();
    });

    // Carregar notas ao iniciar
    loadNotes();

}
