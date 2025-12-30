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
import { Accessibility } from './modules/accessibility.js';
import { getToast } from './modules/toast.js';
import { getLoadingManager } from './modules/loading-manager.js';
import SwipeGestures from './modules/swipe-gestures.js';
import AnimationManager from './modules/animations.js';
import SearchManager from './modules/search.js';
import ScrollToTop from './modules/scroll-to-top.js';
import ThemeManager from './modules/theme-manager.js';
import DataExporter from './modules/data-exporter.js';
import TooltipManager from './modules/tooltips.js';
import EmptyStates from './modules/empty-states.js';

// Instâncias globais para uso em toda aplicação
window.toast = getToast();
window.loader = getLoadingManager();

// ========================================
// INICIALIZAÇÃO
// ========================================

// Testar acesso ao localStorage
try {
    localStorage.setItem('test', 'ok');
    localStorage.removeItem('test');
} catch (e) {
    window.toast.error('Erro ao acessar armazenamento local. Algumas funcionalidades podem não funcionar.');
}

// Inicializar acessibilidade e UX enhancements
new Accessibility();
new SwipeGestures();
new AnimationManager();
new SearchManager();
new ScrollToTop();
new ThemeManager();
new DataExporter();
new TooltipManager();
new EmptyStates();

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
