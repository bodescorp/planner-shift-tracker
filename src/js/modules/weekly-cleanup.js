// ========================================
// LIMPEZA SEMANAL AUTOMÁTICA
// ========================================

import { saveCheckboxState, updateAllProgress } from './activities.js';

export function checkAndClearWeeklyData() {
    const lastClear = localStorage.getItem('lastWeeklyClear');
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    
    const shouldClear = dayOfWeek === 1 && hour === 0 && minutes >= 30 && minutes < 31;
    
    if (shouldClear) {
        const today = now.toDateString();
        
        if (lastClear !== today) {
            console.log('🗑️ Limpeza semanal iniciada...');
            
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = false);
            saveCheckboxState();
            updateAllProgress();
            
            localStorage.setItem('lastWeeklyClear', today);
            console.log('✅ Limpeza semanal concluída!');
        }
    }
}

export function startWeeklyCleanupMonitor() {
    setInterval(checkAndClearWeeklyData, 60 * 1000);
}
