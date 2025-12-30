// ========================================
// GERENCIAMENTO DE ATIVIDADES
// ========================================

import { weekContents, weekButtons, resetBtn } from './dom-elements.js';
import { detectCurrentMode, isConfigured, getStartDate, isWorkDay, updateWeekIndicator } from './cycle-system.js';
import { showConfirmDialog } from './cycle-system.js';
import { updateWaterDisplay } from './notifications.js';
import { updateDayView } from './mobile-view.js';
import { updateMenuIndicators } from './menu.js';
import { saveWeeklyReport } from './reports.js';
import { getDayName } from './utils.js';
import { notifyActivityCompleted } from './pet-system.js';
import AnimationManager from './animations.js';

export function loadState() {
    const savedStartDate = localStorage.getItem('cycleStartDate');
    
    if (!savedStartDate) {
        setTimeout(() => showConfirmDialog(), 500);
        return;
    }
    
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
    updateMenuIndicators();
}

export function switchWeek(week) {
    const allButtons = document.querySelectorAll('.week-btn[data-week]');
    allButtons.forEach(btn => {
        if (btn.dataset.week === week) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
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

export function updateProgress(dayElement) {
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

export function updateAllProgress() {
    document.querySelectorAll('.day-card').forEach(dayCard => {
        updateProgress(dayCard);
    });
}

export function saveCheckboxState() {
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

export function resetCurrentDay() {
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
}

export function initActivities() {
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox, index) => {
        const day = checkbox.dataset.day;
        checkbox.dataset.key = `${day}-${index}`;
        
        checkbox.addEventListener('change', () => {
            const dayCard = checkbox.closest('.day-card');
            updateProgress(dayCard);
            saveCheckboxState();
            
            // Animar checkbox
            AnimationManager.animateCheckbox(checkbox);
            
            // Notificar o mascote quando uma atividade é completada
            if (checkbox.checked) {
                notifyActivityCompleted();
            }
        });
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', resetCurrentDay);
    }

    weekButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchWeek(btn.dataset.week);
        });
    });
}
