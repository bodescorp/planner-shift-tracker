// ========================================
// ELEMENTOS DOM
// ========================================

const weekButtons = document.querySelectorAll('.week-btn');
const weekContents = document.querySelectorAll('.week-content');
const resetBtn = document.getElementById('resetBtn');
const reportModal = document.getElementById('reportModal');
const waterModal = document.getElementById('waterModal');
const closeModal = document.getElementById('closeModal');
const reportContent = document.getElementById('reportContent');
const waterYesBtn = document.getElementById('waterYesBtn');
const waterNoBtn = document.getElementById('waterNoBtn');
const viewToggle = document.getElementById('viewToggle');

// Menu Sanduíche
const menuToggle = document.getElementById('menuToggle');
const sideMenu = document.getElementById('sideMenu');
const menuOverlay = document.getElementById('menuOverlay');
const menuClose = document.getElementById('menuClose');
const menuReportBtn = document.getElementById('menuReportBtn');
const menuResetBtn = document.getElementById('menuResetBtn');
const menuWaterBtn = document.getElementById('menuWaterBtn');
const menuConfirmBtn = document.getElementById('menuConfirmBtn');
const menuViewToggleBtn = document.getElementById('menuViewToggleBtn');
const viewToggleText = document.getElementById('viewToggleText');
const weekIndicator = document.getElementById('weekIndicator');
const menuWeekIndicator = document.getElementById('menuWeekIndicator');
const menuWaterCount = document.getElementById('menuWaterCount');
const dateBadge = document.getElementById('dateBadge');
const waterBadge = document.getElementById('waterBadge');

// ========================================
// MENU SANDUÍCHE
// ========================================

function openMenu() {
    sideMenu.classList.add('active');
    menuOverlay.classList.add('active');
    updateMenuIndicators();
}

function closeMenu() {
    sideMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
}

function updateMenuIndicators() {
    const currentWeek = localStorage.getItem('currentWeek') || 'A';
    const weekLabel = currentWeek === 'A' ? 'Plantão' : 'Folga';
    const today = new Date().toDateString();
    const waterData = JSON.parse(localStorage.getItem('waterData') || '{}');
    const todayWater = waterData[today] || 0;
    
    // Atualizar indicadores no menu
    if (menuWeekIndicator) menuWeekIndicator.textContent = weekLabel;
    if (menuWaterCount) menuWaterCount.textContent = todayWater;
}

if (menuToggle) {
    menuToggle.addEventListener('click', openMenu);
}

if (menuClose) {
    menuClose.addEventListener('click', closeMenu);
}

if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
}

if (menuReportBtn) {
    menuReportBtn.addEventListener('click', () => {
        closeMenu();
        setTimeout(() => {
            if (reportModal) {
                reportModal.classList.add('active');
                generateReport();
            }
        }, 300);
    });
}

if (menuResetBtn) {
    menuResetBtn.addEventListener('click', () => {
        closeMenu();
        setTimeout(() => {
            resetCurrentDay();
        }, 300);
    });
}

if (menuWaterBtn) {
    menuWaterBtn.addEventListener('click', () => {
        closeMenu();
        setTimeout(() => {
            if (waterModal) waterModal.classList.add('active');
        }, 300);
    });
}

if (menuConfirmBtn) {
    menuConfirmBtn.addEventListener('click', () => {
        closeMenu();
        setTimeout(() => {
            showConfirmDialog();
        }, 300);
    });
}

if (menuViewToggleBtn) {
    menuViewToggleBtn.addEventListener('click', () => {
        showAllDays = !showAllDays;
        updateDayView();
        
        if (viewToggleText) {
            viewToggleText.textContent = showAllDays ? 'Ver Apenas Hoje' : 'Ver Todos os Dias';
        }
    });
}

// ========================================
// SISTEMA DE CICLO ALTERNADO (12x36)
// ========================================

const confirmTodayBtn = null; // Removido - agora é menu
const cycleBadge = document.getElementById('cycleBadge');
const dateInfo = document.getElementById('dateInfo');
const menuCycleInfo = document.getElementById('menuCycleInfo');
const menuStartDate = document.getElementById('menuStartDate');

function getTodayDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}

function getStartDate() {
    const saved = localStorage.getItem('cycleStartDate');
    if (saved) {
        return new Date(saved);
    }
    return null;
}

function getDaysSinceStart() {
    const startDate = getStartDate();
    if (!startDate) return null;
    
    const today = getTodayDate();
    const diffTime = today - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function isWorkDay() {
    const daysSinceStart = getDaysSinceStart();
    if (daysSinceStart === null) return null;
    
    // Se dias desde início é par (0, 2, 4...), é dia de trabalho
    // Se ímpar (1, 3, 5...), é folga
    return daysSinceStart % 2 === 0;
}

function detectCurrentMode() {
    const workDay = isWorkDay();
    if (workDay === null) {
        // Não configurado ainda
        return 'A'; // Padrão
    }
    return workDay ? 'A' : 'B';
}

function isConfigured() {
    return getStartDate() !== null;
}

function updateWeekIndicator() {
    const currentWeek = detectCurrentMode();
    const weekLabel = currentWeek === 'A' ? 'Plantão' : 'Folga';
    const daysSinceStart = getDaysSinceStart();
    const startDate = getStartDate();
    const configured = isConfigured();
    const today = new Date();
    
    // Atualizar indicador principal
    if (weekIndicator) {
        weekIndicator.textContent = weekLabel;
        weekIndicator.className = 'week-indicator ' + (currentWeek === 'A' ? 'work' : 'off');
    }
    if (menuWeekIndicator) {
        menuWeekIndicator.textContent = weekLabel;
    }
    
    // Atualizar badge de ciclo
    if (cycleBadge) {
        if (configured) {
            const cycleDay = (daysSinceStart % 2) + 1;
            cycleBadge.textContent = `Dia ${cycleDay}/2`;
        } else {
            cycleBadge.textContent = 'Não configurado';
        }
    }
    
    // Atualizar badge de data
    if (dateBadge) {
        const dateStr = today.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
        dateBadge.textContent = dateStr;
    }
    
    // Atualizar menu
    if (menuCycleInfo && configured) {
        const cycleDay = (daysSinceStart % 2) + 1;
        menuCycleInfo.textContent = `Dia ${cycleDay}/2`;
    }
    
    if (menuStartDate && startDate) {
        menuStartDate.textContent = startDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    
    localStorage.setItem('currentWeek', currentWeek);
}

function confirmTodayAsWorkDay(isWork) {
    const today = getTodayDate();
    
    if (isWork) {
        // Hoje é dia de trabalho, então hoje é dia 0 do ciclo
        localStorage.setItem('cycleStartDate', today.toISOString());
        showNotification('✅ Configurado! Hoje é Plantão. O sistema agora é automático!');
    } else {
        // Hoje é folga, então ontem foi dia de trabalho
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        localStorage.setItem('cycleStartDate', yesterday.toISOString());
        showNotification('✅ Configurado! Hoje é Folga. O sistema agora é automático!');
    }
    
    updateWeekIndicator();
    switchWeek(detectCurrentMode());
    updateConfirmButton();
}

function showConfirmDialog() {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.innerHTML = `
        <div class="confirm-dialog">
            <h2>Bem-vindo</h2>
            <p class="confirm-question">Você está trabalhando hoje?</p>
            <div class="confirm-actions">
                <button class="confirm-btn yes-btn" id="confirmYes">
                    Sim, estou de Plantão
                </button>
                <button class="confirm-btn no-btn" id="confirmNo">
                    Não, estou de Folga
                </button>
            </div>
            <p class="confirm-hint">O sistema calculará automaticamente os próximos dias</p>
        </div>
    `;
    
    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('active'), 10);
    
    document.getElementById('confirmYes').addEventListener('click', () => {
        confirmTodayAsWorkDay(true);
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    });
    
    document.getElementById('confirmNo').addEventListener('click', () => {
        confirmTodayAsWorkDay(false);
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    });
}

function updateConfirmButton() {
    if (!confirmTodayBtn) return;
    
    if (isConfigured()) {
        confirmTodayBtn.innerHTML = `
            <span class="btn-icon">🔄</span>
            <span class="btn-text">Reconfigurar Ciclo</span>
        `;
        confirmTodayBtn.classList.remove('primary');
    } else {
        confirmTodayBtn.innerHTML = `
            <span class="btn-icon">❓</span>
            <span class="btn-text">Hoje é Plantão?</span>
        `;
        confirmTodayBtn.classList.add('primary');
    }
}

function showNotification(message) {
    // Criar toast notification
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

if (confirmTodayBtn) {
    confirmTodayBtn.addEventListener('click', showConfirmDialog);
}

// ========================================
// SERVICE WORKER (PWA)
// ========================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/src/js/sw.js')
            .then(reg => console.log('Service Worker registrado'))
            .catch(err => console.log('Erro ao registrar Service Worker:', err));
    });
}

// ========================================
// UTILIDADES
// ========================================

function getDayName() {
    const days = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    return days[new Date().getDay()];
}

function isMobile() {
    return window.innerWidth <= 768;
}

// ========================================
// VISUALIZAÇÃO MOBILE (DIA ÚNICO)
// ========================================

let showAllDays = false;

function updateDayView() {
    if (!isMobile()) return;
    
    const currentWeek = localStorage.getItem('currentWeek') || 'A';
    const todayName = getDayName();
    const dayKey = `${todayName}-${currentWeek.toLowerCase()}`;
    
    weekContents.forEach(content => {
        const dayCards = content.querySelectorAll('.day-card');
        
        dayCards.forEach(card => {
            card.classList.remove('current-day');
            
            if (card.dataset.day === dayKey) {
                card.classList.add('current-day');
            }
        });
        
        // Aplicar classe para mostrar todos ou só o atual
        if (showAllDays) {
            content.classList.add('show-all-days');
        } else {
            content.classList.remove('show-all-days');
        }
    });
}

if (viewToggle) {
    viewToggle.addEventListener('click', () => {
        showAllDays = !showAllDays;
        updateDayView();
        
        // Atualizar texto do botão
        const desktopView = viewToggle.querySelector('.desktop-view');
        const mobileView = viewToggle.querySelector('.mobile-view');
        
        if (showAllDays) {
            desktopView.textContent = '📅 Todos';
            mobileView.textContent = '📱 Dia Único';
        } else {
            desktopView.textContent = '📱 Dia Único';
            mobileView.textContent = '📅 Todos';
        }
    });
}

// ========================================
// NOTIFICAÇÕES DE ÁGUA
// ========================================

let waterNotificationInterval;
let waterNotificationTimeout;

function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('✅ Permissão de notificação concedida');
            }
        });
    }
}

function showWaterModal() {
    waterModal.classList.add('active');
}

function hideWaterModal() {
    waterModal.classList.remove('active');
}

function startWaterReminder() {
    requestNotificationPermission();
    
    // Notificar a cada 30 minutos via modal
    waterNotificationInterval = setInterval(() => {
        showWaterModal();
        
        // Notificação nativa também (se tiver permissão)
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('💧 Hora de beber água!', {
                body: 'Já se passaram 30 minutos. Você bebeu água?',
                icon: 'icon-192.svg',
                tag: 'water-reminder',
                requireInteraction: false
            });
        }
    }, 30 * 60 * 1000); // 30 minutos
}

function incrementWaterCount() {
    const today = new Date().toDateString();
    const waterData = JSON.parse(localStorage.getItem('waterData') || '{}');
    
    if (!waterData[today]) {
        waterData[today] = 0;
    }
    
    waterData[today]++;
    localStorage.setItem('waterData', JSON.stringify(waterData));
    
    updateWaterDisplay();
    updateMenuIndicators();
    saveWeeklyReport(); // Atualizar relatório
}

function updateWaterDisplay() {
    const today = new Date().toDateString();
    const waterData = JSON.parse(localStorage.getItem('waterData') || '{}');
    const todayCount = waterData[today] || 0;
    
    if (menuWaterCount) {
        menuWaterCount.textContent = `${todayCount} copos`;
    }
    if (waterBadge) {
        waterBadge.textContent = `${todayCount} copos`;
    }
}

// Event listeners do modal de água
waterYesBtn.addEventListener('click', () => {
    incrementWaterCount();
    hideWaterModal();
});

waterNoBtn.addEventListener('click', () => {
    hideWaterModal();
});

// ========================================
// GERENCIAMENTO DE ATIVIDADES
// ========================================

function loadState() {
    const currentWeek = detectCurrentMode();
    const savedChecks = JSON.parse(localStorage.getItem('checkboxes') || '{}');
    
    switchWeek(currentWeek);
    
    Object.keys(savedChecks).forEach(key => {
        const checkbox = document.querySelector(`input[type="checkbox"][data-key="${key}"]`);
        if (checkbox) {
            checkbox.checked = savedChecks[key];
        }
    });
    
    updateAllProgress();
    updateWaterDisplay();
    updateDayView();
    updateWeekIndicator();
    
    // Mostrar diálogo na primeira vez
    if (!isConfigured()) {
        setTimeout(() => showConfirmDialog(), 1000);
    }
}

// Verificar mudança de dia a cada minuto (automático)
setInterval(() => {
    if (isConfigured()) {
        const newWeek = detectCurrentMode();
        const currentWeek = localStorage.getItem('currentWeek');
        if (newWeek !== currentWeek) {
            console.log('Dia mudou - atualizando...');
            switchWeek(newWeek);
            updateWeekIndicator();
            const newLabel = newWeek === 'A' ? 'Plantão' : 'Folga';
            showNotification(`Agora é ${newLabel}`);
        }
    }
}, 60000);

function switchWeek(week) {
    // Atualizar botões (se existirem)
    const allButtons = document.querySelectorAll('.week-btn[data-week]');
    allButtons.forEach(btn => {
        if (btn.dataset.week === week) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Atualizar conteúdo
    weekContents.forEach(content => {
        if (content.id === `semana-${week.toLowerCase()}`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
    
    localStorage.setItem('currentWeek', week);
    updateDayView();
    updateWeekIndicator();
}

weekButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        switchWeek(btn.dataset.week);
    });
});

function updateProgress(dayElement) {
    const checkboxes = dayElement.querySelectorAll('input[type="checkbox"]');
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    const total = checkboxes.length;
    const progressElement = dayElement.querySelector('.progress');
    
    progressElement.textContent = `${checked}/${total}`;
    
    if (checked === total) {
        progressElement.style.background = '#10b981';
        progressElement.style.color = '#fff';
    } else {
        progressElement.style.background = '#1a1a1a';
        progressElement.style.color = '#888';
    }
}

function updateAllProgress() {
    document.querySelectorAll('.day-card').forEach(dayCard => {
        updateProgress(dayCard);
    });
}

function saveCheckboxState() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const state = {};
    
    checkboxes.forEach((checkbox, index) => {
        const day = checkbox.dataset.day;
        const key = `${day}-${index}`;
        checkbox.dataset.key = key;
        state[key] = checkbox.checked;
    });
    
    localStorage.setItem('checkboxes', JSON.stringify(state));
    saveWeeklyReport();
}

document.querySelectorAll('input[type="checkbox"]').forEach((checkbox, index) => {
    const day = checkbox.dataset.day;
    checkbox.dataset.key = `${day}-${index}`;
    
    checkbox.addEventListener('change', () => {
        const dayCard = checkbox.closest('.day-card');
        updateProgress(dayCard);
        saveCheckboxState();
    });
});

resetBtn.addEventListener('click', () => {
    const currentWeek = localStorage.getItem('currentWeek') || 'A';
    const activeWeekContent = document.querySelector('.week-content.active');
    
    if (!activeWeekContent) return;
    
    const todayName = getDayName();
    const suffix = currentWeek.toLowerCase();
    
    const todayCard = activeWeekContent.querySelector(`[data-day="${todayName}-${suffix}"]`);
    
    if (todayCard) {
        const checkboxes = todayCard.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.checked = false;
        });
        updateProgress(todayCard);
        saveCheckboxState();
    }
});

// ========================================
// LIMPEZA SEMANAL AUTOMÁTICA
// ========================================

function checkAndClearWeeklyData() {
    const lastClear = localStorage.getItem('lastWeeklyClear');
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Domingo, 1 = Segunda, etc
    const hour = now.getHours();
    const minutes = now.getMinutes();
    
    // Segunda-feira (1) às 00:30
    const shouldClear = dayOfWeek === 1 && hour === 0 && minutes >= 30 && minutes < 31;
    
    if (shouldClear) {
        const today = now.toDateString();
        
        // Verificar se já limpou hoje
        if (lastClear !== today) {
            console.log('🗑️ Limpeza semanal iniciada...');
            
            // Limpar checkboxes
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = false);
            saveCheckboxState();
            updateAllProgress();
            
            // Registrar limpeza
            localStorage.setItem('lastWeeklyClear', today);
            console.log('✅ Limpeza semanal concluída!');
        }
    }
}

// Verificar a cada minuto
setInterval(checkAndClearWeeklyData, 60 * 1000);

// ========================================
// RELATÓRIO SEMANAL
// ========================================

function saveWeeklyReport() {
    const today = new Date();
    const weekKey = getWeekKey(today);
    
    const reports = JSON.parse(localStorage.getItem('weeklyReports') || '{}');
    
    if (!reports[weekKey]) {
        reports[weekKey] = {
            startDate: getWeekStart(today).toISOString(),
            activities: {},
            completedDays: 0,
            waterTotal: 0
        };
    }
    
    // Calcular atividades completadas
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let total = 0;
    let completed = 0;
    
    checkboxes.forEach(cb => {
        total++;
        if (cb.checked) completed++;
    });
    
    reports[weekKey].activities = {
        total,
        completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
    
    // Calcular dias completados
    const dayCards = document.querySelectorAll('.day-card');
    let completedDaysCount = 0;
    
    dayCards.forEach(card => {
        const cardCheckboxes = card.querySelectorAll('input[type="checkbox"]');
        const cardCompleted = Array.from(cardCheckboxes).filter(cb => cb.checked).length;
        const cardTotal = cardCheckboxes.length;
        
        if (cardCompleted === cardTotal && cardTotal > 0) {
            completedDaysCount++;
        }
    });
    
    reports[weekKey].completedDays = completedDaysCount;
    
    // Calcular água da semana
    const waterData = JSON.parse(localStorage.getItem('waterData') || '{}');
    let weekWaterTotal = 0;
    const weekStart = getWeekStart(today);
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        const dateKey = date.toDateString();
        weekWaterTotal += waterData[dateKey] || 0;
    }
    
    reports[weekKey].waterTotal = weekWaterTotal;
    
    localStorage.setItem('weeklyReports', JSON.stringify(reports));
}

function getWeekKey(date) {
    const start = getWeekStart(date);
    return start.toISOString().split('T')[0];
}

function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

function generateReport() {
    const today = new Date();
    const weekKey = getWeekKey(today);
    const reports = JSON.parse(localStorage.getItem('weeklyReports') || '{}');
    const waterData = JSON.parse(localStorage.getItem('waterData') || '{}');
    
    // Relatório da semana atual
    const currentWeekReport = reports[weekKey] || {
        activities: { total: 0, completed: 0, percentage: 0 },
        completedDays: 0,
        waterTotal: 0
    };
    
    // Água hoje
    const waterToday = waterData[today.toDateString()] || 0;
    
    // Histórico das últimas 4 semanas
    const last4Weeks = [];
    for (let i = 0; i < 4; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (i * 7));
        const key = getWeekKey(date);
        const weekStart = getWeekStart(date);
        
        if (reports[key]) {
            last4Weeks.push({
                week: `${formatDate(weekStart)} - ${formatDate(new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000))}`,
                ...reports[key]
            });
        }
    }
    
    // Média de água diária
    const avgWater = currentWeekReport.waterTotal > 0 
        ? Math.round(currentWeekReport.waterTotal / 7) 
        : 0;
    
    // Gerar HTML do relatório
    reportContent.innerHTML = `
        <div class="report-section">
            <h3>📊 Semana Atual</h3>
            <div class="report-grid">
                <div class="report-card">
                    <div class="report-card-title">Atividades</div>
                    <div class="report-card-value">${currentWeekReport.activities.completed}/${currentWeekReport.activities.total}</div>
                    <div class="report-card-subtitle">${currentWeekReport.activities.percentage}% concluído</div>
                </div>
                <div class="report-card">
                    <div class="report-card-title">Dias Completos</div>
                    <div class="report-card-value">${currentWeekReport.completedDays}/7</div>
                    <div class="report-card-subtitle">100% concluídos</div>
                </div>
                <div class="report-card">
                    <div class="report-card-title">💧 Água (Hoje)</div>
                    <div class="report-card-value">${waterToday}</div>
                    <div class="report-card-subtitle">copos hoje</div>
                </div>
                <div class="report-card">
                    <div class="report-card-title">💧 Água (Semana)</div>
                    <div class="report-card-value">${currentWeekReport.waterTotal}</div>
                    <div class="report-card-subtitle">média ${avgWater}/dia</div>
                </div>
            </div>
        </div>
        
        ${last4Weeks.length > 0 ? `
            <div class="report-section">
                <h3>📈 Histórico (Últimas 4 Semanas)</h3>
                <div class="report-list">
                    ${last4Weeks.map(week => `
                        <div class="report-list-item">
                            <span class="report-list-label">${week.week}</span>
                            <span class="report-list-value">
                                ${week.activities.percentage}% • ${week.completedDays} dias • ${week.waterTotal}💧
                            </span>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
        
        <div class="report-section">
            <h3>💡 Informações</h3>
            <div class="report-list">
                <div class="report-list-item">
                    <span class="report-list-label">📅 Limpeza Automática</span>
                    <span class="report-list-value">Toda segunda 00:30</span>
                </div>
                <div class="report-list-item">
                    <span class="report-list-label">💧 Meta de Água</span>
                    <span class="report-list-value">8-10 copos/dia</span>
                </div>
                <div class="report-list-item">
                    <span class="report-list-label">🔔 Lembretes</span>
                    <span class="report-list-value">A cada 30 minutos</span>
                </div>
                <div class="report-list-item">
                    <span class="report-list-label">🎯 Meta Semanal</span>
                    <span class="report-list-value">80%+ atividades</span>
                </div>
            </div>
        </div>
    `;
}

// Event listeners do modal de relatório
if (closeModal && reportModal) {
    closeModal.addEventListener('click', (e) => {
        e.stopPropagation();
        reportModal.classList.remove('active');
    });
}

if (reportModal) {
    reportModal.addEventListener('click', (e) => {
        if (e.target === reportModal) {
            reportModal.classList.remove('active');
        }
    });
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + R para resetar (prevenido, removido)
    // Ctrl/Cmd + 1 para Semana A
    if ((e.ctrlKey || e.metaKey) && e.key === '1') {
        e.preventDefault();
        switchWeek('A');
    }
    
    // Ctrl/Cmd + 2 para Semana B
    if ((e.ctrlKey || e.metaKey) && e.key === '2') {
        e.preventDefault();
        switchWeek('B');
    }
    
    // ESC para fechar modais
    if (e.key === 'Escape') {
        if (reportModal) reportModal.classList.remove('active');
        if (waterModal) waterModal.classList.remove('active');
    }
});

// ========================================
// INICIALIZAÇÃO
// ========================================

loadState();
startWaterReminder();
checkAndClearWeeklyData();

// Atualizar visualização mobile ao redimensionar
window.addEventListener('resize', () => {
    updateDayView();
});

// Solicitar permissão de notificação após 2 segundos
setTimeout(() => {
    requestNotificationPermission();
}, 2000);

console.log('✅ Cronograma Semanal carregado!');
console.log('📱 Mobile: Visualização de dia único ativada');
console.log('💧 Notificações de água: A cada 30 minutos');
console.log('🗑️ Limpeza automática: Toda segunda 00:30');
