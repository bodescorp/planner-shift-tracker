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
    
    const currentWeekReport = reports[weekKey] || {
        activities: { total: 0, completed: 0, percentage: 0 },
        completedDays: 0,
        waterTotal: 0
    };
    
    const waterToday = waterData[today.toDateString()] || 0;
    
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
