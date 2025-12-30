// ========================================
// RELATÓRIO SEMANAL
// ========================================

import { reportModal, closeModal, reportContent } from './dom-elements.js';
import { getWeekKey, getWeekStart } from './utils.js';
import { switchWeek } from './activities.js';

export function saveWeeklyReport() {
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

export function generateReport() {
    const today = new Date();
    const weekKey = getWeekKey(today);
    const reports = JSON.parse(localStorage.getItem('weeklyReports') || '{}');
    const waterData = JSON.parse(localStorage.getItem('waterData') || '{}');
    const petData = JSON.parse(localStorage.getItem('petData') || '{}');
    
    const currentWeekReport = reports[weekKey] || {
        activities: { total: 0, completed: 0, percentage: 0 },
        completedDays: 0,
        waterTotal: 0
    };
    
    const waterToday = waterData[today.toDateString()] || 0;
    
    // Calcular estatísticas gerais
    const allReports = Object.values(reports);
    const totalWeeks = allReports.length;
    const avgCompletionRate = totalWeeks > 0 
        ? Math.round(allReports.reduce((sum, r) => sum + r.activities.percentage, 0) / totalWeeks)
        : 0;
    
    // Calcular streak (semanas consecutivas acima de 80%)
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    const sortedKeys = Object.keys(reports).sort().reverse();
    
    sortedKeys.forEach(key => {
        if (reports[key].activities.percentage >= 80) {
            tempStreak++;
            if (key === weekKey) currentStreak = tempStreak;
        } else {
            if (tempStreak > bestStreak) bestStreak = tempStreak;
            tempStreak = 0;
        }
    });
    if (tempStreak > bestStreak) bestStreak = tempStreak;
    
    // Últimas 4 semanas
    const last4Weeks = [];
    for (let i = 0; i < 4; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (i * 7));
        const key = getWeekKey(date);
        const weekStart = getWeekStart(date);
        
        if (reports[key]) {
            last4Weeks.push({
                week: `${weekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}`,
                activities: reports[key].activities,
                completedDays: reports[key].completedDays,
                waterTotal: reports[key].waterTotal
            });
        }
    }
    
    const avgWater = currentWeekReport.waterTotal > 0 
        ? Math.round(currentWeekReport.waterTotal / 7) 
        : 0;
    
    // Conquistas do mascote
    const petLevel = petData.level || 1;
    const petXP = petData.xp || 0;
    const petTasks = petData.totalActivitiesCompleted || 0;
    
    // Dias até limpar (próxima segunda)
    const daysUntilClean = (8 - today.getDay()) % 7 || 7;
    
    reportContent.innerHTML = `
        <div class="report-section">
            <h3>📊 Semana Atual</h3>
            <div class="report-grid">
                <div class="report-card">
                    <div class="report-card-title">Conclusão</div>
                    <div class="report-card-value">${currentWeekReport.activities.percentage}%</div>
                    <div class="report-card-subtitle">${currentWeekReport.activities.completed} de ${currentWeekReport.activities.total} atividades</div>
                    <div class="progress-bar-mini" style="margin-top: 12px;">
                        <div class="progress-fill-mini" style="width: ${currentWeekReport.activities.percentage}%"></div>
                    </div>
                </div>
                <div class="report-card">
                    <div class="report-card-title">Dias 100%</div>
                    <div class="report-card-value">${currentWeekReport.completedDays}<span style="font-size: 1.2rem; opacity: 0.5;">/7</span></div>
                    <div class="report-card-subtitle">${Math.round((currentWeekReport.completedDays / 7) * 100)}% dos dias completos</div>
                </div>
                <div class="report-card">
                    <div class="report-card-title">💧 Hoje</div>
                    <div class="report-card-value">${waterToday}</div>
                    <div class="report-card-subtitle">${waterToday >= 8 ? '✅ Meta atingida!' : `Faltam ${8 - waterToday} copos`}</div>
                </div>
                <div class="report-card">
                    <div class="report-card-title">💧 Semana</div>
                    <div class="report-card-value">${currentWeekReport.waterTotal}</div>
                    <div class="report-card-subtitle">média ${avgWater}/dia ${avgWater >= 8 ? '✅' : ''}</div>
                </div>
            </div>
        </div>
        
        ${totalWeeks > 0 ? `
            <div class="report-section">
                <h3>🎯 Desempenho Geral</h3>
                <div class="report-grid" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));">
                    <div class="report-card">
                        <div class="report-card-title">Média Geral</div>
                        <div class="report-card-value">${avgCompletionRate}%</div>
                        <div class="report-card-subtitle">${totalWeeks} semanas</div>
                    </div>
                    <div class="report-card">
                        <div class="report-card-title">Sequência Atual</div>
                        <div class="report-card-value">${currentStreak}</div>
                        <div class="report-card-subtitle">${currentStreak === 1 ? 'semana' : 'semanas'} ≥80%</div>
                    </div>
                    <div class="report-card">
                        <div class="report-card-title">Melhor Sequência</div>
                        <div class="report-card-value">${bestStreak}</div>
                        <div class="report-card-subtitle">${bestStreak === 1 ? 'semana' : 'semanas'} consecutivas</div>
                    </div>
                    <div class="report-card">
                        <div class="report-card-title">🐾 Mascote</div>
                        <div class="report-card-value">Nv.${petLevel}</div>
                        <div class="report-card-subtitle">${petTasks} tarefas completas</div>
                    </div>
                </div>
            </div>
        ` : ''}
        
        ${last4Weeks.length > 0 ? `
            <div class="report-section">
                <h3>📈 Histórico Recente</h3>
                <div class="report-list">
                    ${last4Weeks.map((week, idx) => `
                        <div class="report-list-item">
                            <div>
                                <span class="report-list-label">${week.week}</span>
                                ${idx === 0 ? '<span style="font-size: 0.75rem; opacity: 0.5; margin-left: 8px;">(atual)</span>' : ''}
                            </div>
                            <div style="display: flex; gap: 16px; align-items: center;">
                                <span class="report-metric">${week.activities.percentage}%</span>
                                <span class="report-metric">${week.completedDays}d</span>
                                <span class="report-metric">${week.waterTotal}💧</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
        
        <div class="report-section">
            <h3>💡 Informações do Sistema</h3>
            <div class="report-list">
                <div class="report-list-item">
                    <span class="report-list-label">📅 Próxima Limpeza</span>
                    <span class="report-list-value">${daysUntilClean === 1 ? 'Amanhã' : daysUntilClean === 0 ? 'Hoje' : `${daysUntilClean} dias`} (seg 00:30)</span>
                </div>
                <div class="report-list-item">
                    <span class="report-list-label">💧 Meta Diária</span>
                    <span class="report-list-value">8-10 copos</span>
                </div>
                <div class="report-list-item">
                    <span class="report-list-label">🔔 Lembretes</span>
                    <span class="report-list-value">A cada 30 min</span>
                </div>
                <div class="report-list-item">
                    <span class="report-list-label">🎯 Meta Semanal</span>
                    <span class="report-list-value">≥80% atividades</span>
                </div>
                <div class="report-list-item">
                    <span class="report-list-label">📊 Total Registrado</span>
                    <span class="report-list-value">${totalWeeks} ${totalWeeks === 1 ? 'semana' : 'semanas'}</span>
                </div>
            </div>
        </div>
        
        ${currentWeekReport.activities.percentage >= 80 ? `
            <div class="report-achievement">
                <div class="achievement-icon">🎉</div>
                <div class="achievement-text">
                    <strong>Parabéns!</strong>
                    <span>Você está indo muito bem esta semana!</span>
                </div>
            </div>
        ` : currentWeekReport.activities.percentage >= 50 ? `
            <div class="report-achievement warning">
                <div class="achievement-icon">💪</div>
                <div class="achievement-text">
                    <strong>Continue!</strong>
                    <span>Você está no caminho certo, não desista!</span>
                </div>
            </div>
        ` : ''}
    `;
}

export function initReports() {
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
}

export function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === '1') {
            e.preventDefault();
            switchWeek('A');
        }
        
        if ((e.ctrlKey || e.metaKey) && e.key === '2') {
            e.preventDefault();
            switchWeek('B');
        }
        
        if (e.key === 'Escape') {
            if (reportModal) reportModal.classList.remove('active');
            const waterModal = document.getElementById('waterModal');
            if (waterModal) waterModal.classList.remove('active');
        }
    });
}
