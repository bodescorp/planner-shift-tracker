// ========================================
// PLANNER SHIFT TRACKER - APLICAÇÃO PRINCIPAL
// ========================================

// Importar módulos
import { initMenu } from './modules/menu.js';
import { loadState, initActivities } from './modules/activities.js';
import { startDayChangeMonitor } from './modules/cycle-system.js';
import { updateDayView } from './modules/mobile-view.js';
import { 
    startWaterReminder, 
    requestNotificationPermission,
    initWaterNotifications 
} from './modules/notifications.js';
import { startWeeklyCleanupMonitor, checkAndClearWeeklyData } from './modules/weekly-cleanup.js';
import { initReports, initKeyboardShortcuts } from './modules/reports.js';
import { registerServiceWorker } from './modules/service-worker-register.js';
import { initTabsManager } from './modules/tabs-manager.js';
import { initMeditationPlayer } from './modules/meditation-player.js';
import { initPetSystem, initMainPetWidget } from './modules/pet-system.js';

// ========================================
// INICIALIZAÇÃO
// ========================================

// Testar acesso ao localStorage
try {
    localStorage.setItem('test', 'ok');
    localStorage.removeItem('test');
} catch (e) {
    // Erro de acesso ao localStorage
}

// Inicializar módulos
initMenu();
initActivities();
initWaterNotifications();
initReports();
initKeyboardShortcuts();
initPetSystem();
initTabsManager();
initMeditationPlayer();
registerServiceWorker();

// Carregar estado da aplicação
loadState();

// Inicializar widget do mascote na página principal
// Aguardar DOM e outros módulos carregarem
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => initMainPetWidget(), 800);
    });
} else {
    setTimeout(() => initMainPetWidget(), 800);
}

// Iniciar monitores
startDayChangeMonitor();
startWaterReminder();
startWeeklyCleanupMonitor();
checkAndClearWeeklyData();

// Atualizar visualização mobile ao redimensionar
window.addEventListener('resize', () => {
    updateDayView();
});

// Solicitar permissão de notificação após 2 segundos
setTimeout(() => {
    requestNotificationPermission();
}, 2000);
