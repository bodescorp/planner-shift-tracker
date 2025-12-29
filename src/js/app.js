// ========================================
// PLANNER SHIFT TRACKER - APLICAÇÃO PRINCIPAL
// ========================================

console.log('🚀 Script app.js iniciado!');
console.log(`📅 Data atual: ${new Date().toLocaleString('pt-BR')}`);

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

console.log('🚀 Iniciando aplicação Planner Shift Tracker...');
console.log('📦 Carregando dados do localStorage/cache...');

// Testar acesso ao localStorage
try {
    localStorage.setItem('test', 'ok');
    const testValue = localStorage.getItem('test');
    localStorage.removeItem('test');
    console.log(`✅ localStorage acessível: ${testValue === 'ok' ? 'SIM' : 'NÃO'}`);
} catch (e) {
    console.error('❌ ERRO: localStorage não está acessível!', e);
}

console.log(`🔍 Debug localStorage: cycleStartDate = ${localStorage.getItem('cycleStartDate')}`);
console.log(`🔍 Debug localStorage: currentWeek = ${localStorage.getItem('currentWeek')}`);

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

console.log('✅ Cronograma Semanal carregado!');
console.log('📱 Mobile: Visualização de dia único ativada');
console.log('💧 Notificações de água: A cada 30 minutos');
console.log('🗑️ Limpeza automática: Toda segunda 00:30');
console.log('💾 Cache: Todas as configurações são salvas automaticamente no localStorage');
