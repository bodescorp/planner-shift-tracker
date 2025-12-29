// ========================================
// NOTIFICAÇÕES DE ÁGUA
// ========================================

import { waterModal, waterYesBtn, waterNoBtn, menuWaterCount, waterBadge } from './dom-elements.js';
import { updateMenuIndicators } from './menu.js';
import { saveWeeklyReport } from './reports.js';

let waterNotificationInterval;

export function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
        });
    }
}

export function showWaterModal() {
    waterModal.classList.add('active');
}

export function hideWaterModal() {
    waterModal.classList.remove('active');
}

export function startWaterReminder() {
    requestNotificationPermission();
    
    // Função para mostrar notificação e modal
    const showWaterNotification = () => {
        showWaterModal();
        
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('💧 Hidratação', {
                body: 'Você bebeu água nos últimos 30 minutos?',
                icon: '/src/assets/icon-192.svg',
                badge: '/src/assets/icon-192.svg',
                tag: 'water-reminder',
                requireInteraction: false
            });
        }
    };
    
    // Mostrar primeira notificação após 30 minutos
    setTimeout(() => {
        showWaterNotification();
        
        // Depois continuar mostrando a cada 30 minutos
        waterNotificationInterval = setInterval(() => {
            showWaterNotification();
        }, 30 * 60 * 1000);
    }, 30 * 60 * 1000);
}

export function incrementWaterCount() {
    const today = new Date().toDateString();
    const waterData = JSON.parse(localStorage.getItem('waterData') || '{}');
    
    if (!waterData[today]) {
        waterData[today] = 0;
    }
    
    waterData[today]++;
    localStorage.setItem('waterData', JSON.stringify(waterData));
    
    updateWaterDisplay();
    updateMenuIndicators();
    saveWeeklyReport();
}

export function updateWaterDisplay() {
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

export function initWaterNotifications() {
    if (waterYesBtn) {
        waterYesBtn.addEventListener('click', () => {
            incrementWaterCount();
            hideWaterModal();
        });
    }

    if (waterNoBtn) {
        waterNoBtn.addEventListener('click', () => {
            hideWaterModal();
        });
    }
}
