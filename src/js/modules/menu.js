// ========================================
// MENU SANDUÍCHE
// ========================================

import { 
    menuToggle, sideMenu, menuOverlay, menuClose, menuReportBtn, 
    menuResetBtn, menuResetAppBtn, menuWaterBtn, menuConfirmBtn, menuViewToggleBtn,
    viewToggleText, menuWeekIndicator, menuWaterCount, reportModal, waterModal
} from './dom-elements.js';
import { generateReport } from './reports.js';
import { resetCurrentDay } from './activities.js';
import { showConfirmDialog } from './cycle-system.js';
import { updateDayView, toggleViewMode } from './mobile-view.js';

export function openMenu() {
    sideMenu.classList.add('active');
    menuOverlay.classList.add('active');
    updateMenuIndicators();
}

export function closeMenu() {
    sideMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
}

export function updateMenuIndicators() {
    const currentWeek = localStorage.getItem('currentWeek') || 'A';
    const today = new Date().toDateString();
    const waterData = JSON.parse(localStorage.getItem('waterData') || '{}');
    const todayWater = waterData[today] || 0;
    
    if (menuWeekIndicator) {
        menuWeekIndicator.textContent = `Semana ${currentWeek}`;
    }
    if (menuWaterCount) menuWaterCount.textContent = todayWater;
}

function resetApplication() {
    // Limpar localStorage
    localStorage.clear();
    
    // Limpar cache do Service Worker
    if ('caches' in window) {
        caches.keys().then(names => {
            names.forEach(name => {
                caches.delete(name);
            });
        });
    }
    
    // Desregistrar Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => {
                registration.unregister();
            });
        });
    }
    
    // Recarregar página após um pequeno delay
    setTimeout(() => {
        window.location.reload(true);
    }, 500);
}

export function initMenu() {
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
            setTimeout(() => resetCurrentDay(), 300);
        });
    }

    if (menuResetAppBtn) {
        menuResetAppBtn.addEventListener('click', () => {
            if (confirm('⚠️ Isso irá limpar TODOS os dados e resetar a aplicação. Tem certeza?')) {
                closeMenu();
                resetApplication();
            }
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
            setTimeout(() => showConfirmDialog(), 300);
        });
    }

    if (menuViewToggleBtn) {
        menuViewToggleBtn.addEventListener('click', () => {
            toggleViewMode();
            
            if (viewToggleText) {
                const showAllDays = localStorage.getItem('showAllDays') === 'true';
                viewToggleText.textContent = showAllDays ? 'Ver Apenas Hoje' : 'Ver Todos os Dias';
            }
        });
    }
}
