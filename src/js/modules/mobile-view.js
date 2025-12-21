// ========================================
// VISUALIZAÇÃO MOBILE (DIA ÚNICO)
// ========================================

import { weekContents } from './dom-elements.js';
import { getDayName, isMobile } from './utils.js';

export function updateDayView() {
    if (!isMobile()) return;
    
    const currentWeek = localStorage.getItem('currentWeek') || 'A';
    const todayName = getDayName();
    const dayKey = `${todayName}-${currentWeek.toLowerCase()}`;
    const showAllDays = localStorage.getItem('showAllDays') === 'true';
    
    weekContents.forEach(content => {
        const dayCards = content.querySelectorAll('.day-card');
        
        dayCards.forEach(card => {
            const isToday = card.dataset.day === dayKey;
            if (showAllDays) {
                card.style.display = 'block';
            } else {
                card.style.display = isToday ? 'block' : 'none';
            }
        });
        
        if (showAllDays) {
            content.classList.add('show-all');
        } else {
            content.classList.remove('show-all');
        }
    });
}

export function toggleViewMode() {
    const showAllDays = localStorage.getItem('showAllDays') === 'true';
    localStorage.setItem('showAllDays', (!showAllDays).toString());
    updateDayView();
}
