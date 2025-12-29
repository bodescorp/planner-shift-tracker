// ========================================
// SISTEMA DE CICLO ALTERNADO (12x36)
// ========================================

import { cycleBadge, weekIndicator, menuWeekIndicator, dateBadge, menuCycleInfo, menuStartDate } from './dom-elements.js';
import { showNotification } from './utils.js';
import { switchWeek } from './activities.js';
import { updateMenuIndicators } from './menu.js';

export function getTodayDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}

export function getStartDate() {
    const saved = localStorage.getItem('cycleStartDate');
    if (saved) {
        const date = new Date(saved);
        
        if (isNaN(date.getTime())) {
            return null;
        }
        
        return date;
    }
    return null;
}

export function getDaysSinceStart(date = null) {
    const startDate = getStartDate();
    if (!startDate) return null;
    
    const targetDate = date || getTodayDate();
    const diffTime = targetDate - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

export function isWorkDay(date = null) {
    const targetDate = date || getTodayDate();
    const daysSinceStart = getDaysSinceStart(targetDate);
    
    if (daysSinceStart === null) return null;
    
    // Determina qual semana: A ou B (alterna a cada 7 dias)
    const weekNumber = Math.floor(daysSinceStart / 7) % 2;
    const dayOfWeek = targetDate.getDay(); // 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sáb
    
    let isWork = false;
    let weekType = '';
    
    if (weekNumber === 0) {
        // Semana A: trabalha Segunda(1), Quarta(3), Sexta(5)
        isWork = [1, 3, 5].includes(dayOfWeek);
        weekType = 'A';
    } else {
        // Semana B: trabalha Terça(2), Quinta(4), Sábado(6)
        isWork = [2, 4, 6].includes(dayOfWeek);
        weekType = 'B';
    }
    
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    return isWork;
}

export function detectCurrentMode() {
    const startDate = getStartDate();
    if (!startDate) return 'A';
    
    const today = getTodayDate();
    const daysSinceStart = getDaysSinceStart(today);
    
    // Determina qual semana estamos (A ou B)
    const weekNumber = Math.floor(daysSinceStart / 7) % 2;
    
    // Semana A (weekNumber 0) ou Semana B (weekNumber 1)
    const currentWeek = weekNumber === 0 ? 'A' : 'B';
    
    
    return currentWeek;
}

export function isConfigured() {
    return getStartDate() !== null;
}

export function updateWeekIndicator() {
    const currentWeek = detectCurrentMode();
    const isWork = isWorkDay();
    const weekLabel = isWork ? 'Trabalho' : 'Folga';
    const daysSinceStart = getDaysSinceStart();
    const startDate = getStartDate();
    const configured = isConfigured();
    const today = new Date();
    
    if (weekIndicator) {
        weekIndicator.textContent = `Semana ${currentWeek}`;
        weekIndicator.className = 'week-indicator ' + (isWork ? 'work' : 'off');
    }
    if (menuWeekIndicator) {
        menuWeekIndicator.textContent = `Semana ${currentWeek} - ${weekLabel}`;
    }
    
    if (cycleBadge) {
        if (configured) {
            const weekNumber = Math.floor(daysSinceStart / 7) + 1;
            cycleBadge.textContent = `Semana ${weekNumber}`;
        } else {
            cycleBadge.textContent = 'Não configurado';
        }
    }
    
    if (dateBadge) {
        const dateStr = today.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
        dateBadge.textContent = dateStr;
    }
    
    if (menuCycleInfo && configured) {
        const weekNumber = Math.floor(daysSinceStart / 7) + 1;
        menuCycleInfo.textContent = `Semana ${weekNumber}`;
    }
    
    if (menuStartDate && startDate) {
        menuStartDate.textContent = startDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    
    localStorage.setItem('currentWeek', currentWeek);
}

export function confirmTodayAsWorkDay(isWork) {
    const today = getTodayDate();
    const dayOfWeek = today.getDay();
    const dayNames = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    
    
    // Precisamos calcular qual dia seria o início da Semana A atual
    // Semana A: trabalha Seg(1), Qua(3), Sex(5), Dom(0)
    // Semana B: trabalha Ter(2), Qui(4), Sáb(6)
    
    let startDate;
    
    if (isWork) {
        // Se hoje é trabalho, determinar qual semana baseado no dia da semana
        if ([1, 3, 5, 0].includes(dayOfWeek)) {
            // Hoje trabalha Seg/Qua/Sex/Dom -> Semana A
            // Calcular início da semana (domingo mais próximo)
            if (dayOfWeek === 0) {
                // Se é domingo, ele mesmo é o início
                startDate = new Date(today);
            } else {
                // Voltar até o domingo anterior
                const daysToSunday = dayOfWeek;
                startDate = new Date(today);
                startDate.setDate(today.getDate() - daysToSunday);
            }
        } else if ([2, 4, 6].includes(dayOfWeek)) {
            // Hoje trabalha Ter/Qui/Sáb -> Semana B
            // Precisa voltar 7 dias + dias até domingo
            const daysToLastSunday = dayOfWeek + 7;
            startDate = new Date(today);
            startDate.setDate(today.getDate() - daysToLastSunday);
        }
    } else {
        // Se hoje é folga, determinar qual semana baseado no dia da semana
        if ([2, 4, 6].includes(dayOfWeek)) {
            // Hoje NÃO trabalha Ter/Qui/Sáb -> Semana A (trabalha Seg/Qua/Sex/Dom)
            const daysToSunday = dayOfWeek;
            startDate = new Date(today);
            startDate.setDate(today.getDate() - daysToSunday);
        } else if ([1, 3, 5].includes(dayOfWeek)) {
            // Hoje NÃO trabalha Seg/Qua/Sex -> Semana B (trabalha Ter/Qui/Sáb)
            const daysToLastSunday = dayOfWeek + 7;
            startDate = new Date(today);
            startDate.setDate(today.getDate() - daysToLastSunday);
        } else if (dayOfWeek === 0) {
            // Domingo como folga -> Semana B
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 7); // Volta 1 semana para o domingo anterior
        }
    }
    
    localStorage.setItem('cycleStartDate', startDate.toISOString());
    
    const verificacao = localStorage.getItem('cycleStartDate');
    
    if (!verificacao) {
        alert('❌ Erro ao salvar configuração! Verifique se o localStorage está habilitado no navegador.');
        return;
    }
    
    
    const newMode = detectCurrentMode();
    const isWorkToday = isWorkDay();
    const modeLabel = isWorkToday ? 'Trabalho' : 'Folga';
    
    
    updateWeekIndicator();
    switchWeek(newMode);
    updateMenuIndicators();
    
    showNotification(`✅ Configurado! Semana ${newMode} - Hoje é ${modeLabel}`);
    
}

export function showConfirmDialog() {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    
    const startDate = getStartDate();
    const daysSince = getDaysSinceStart();
    const today = getTodayDate();
    const dayOfWeek = today.getDay();
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    
    let currentStatus = 'Não configurado';
    if (startDate) {
        const weekNum = Math.floor(daysSince / 7) % 2;
        const isWork = isWorkDay();
        currentStatus = `Semana ${weekNum === 0 ? 'A' : 'B'} - ${isWork ? 'Trabalho' : 'Folga'}`;
    }
    
    const todayInfo = `
        <p class="confirm-hint" style="font-size: 0.85rem; color: #888; margin: 0.5rem 0;">
            Hoje é <strong>${dayNames[dayOfWeek]}</strong>, ${today.toLocaleDateString('pt-BR')}
        </p>
        <p class="confirm-hint" style="font-size: 0.75rem; color: #666;">
            • Semana A: trabalha Seg, Qua, Sex<br>
            • Semana B: trabalha Ter, Qui, Sáb
        </p>
    `;
    
    const debugInfo = startDate ? `
        <p class="confirm-hint" style="font-size: 0.75rem; color: #666; margin-top: 0.5rem;">
            Debug: Início em ${startDate.toLocaleDateString('pt-BR')} 
            (há ${daysSince} dias) - Sistema mostra: ${currentStatus}
        </p>
    ` : '';
    
    overlay.innerHTML = `
        <div class="confirm-dialog">
            <h2>${startDate ? 'Reconfigurar Sistema' : 'Configurar Escala 12x36'}</h2>
            ${todayInfo}
            <p class="confirm-question">Você está trabalhando hoje?</p>
            <div class="confirm-actions">
                <button class="confirm-btn yes-btn" id="confirmYes">
                    ✅ Sim, estou Trabalhando
                </button>
                <button class="confirm-btn no-btn" id="confirmNo">
                    🏠 Não, estou de Folga
                </button>
            </div>
            <p class="confirm-hint">O sistema alternará automaticamente entre as semanas</p>
            ${debugInfo}
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

// Verificar mudança de dia a cada minuto
export function startDayChangeMonitor() {
    setInterval(() => {
        if (isConfigured()) {
            const newWeek = detectCurrentMode();
            const currentWeek = localStorage.getItem('currentWeek');
            if (newWeek !== currentWeek) {
                switchWeek(newWeek);
                updateWeekIndicator();
                const newLabel = newWeek === 'A' ? 'Plantão' : 'Folga';
                showNotification(`Agora é ${newLabel}`);
            }
        }
    }, 60000);
}
