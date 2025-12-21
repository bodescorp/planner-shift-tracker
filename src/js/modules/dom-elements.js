// ========================================
// ELEMENTOS DOM
// ========================================

export const weekButtons = document.querySelectorAll('.week-btn');
export const weekContents = document.querySelectorAll('.week-content');
export const resetBtn = document.getElementById('resetBtn');
export const reportModal = document.getElementById('reportModal');
export const waterModal = document.getElementById('waterModal');
export const closeModal = document.getElementById('closeModal');
export const reportContent = document.getElementById('reportContent');
export const waterYesBtn = document.getElementById('waterYesBtn');
export const waterNoBtn = document.getElementById('waterNoBtn');
export const viewToggle = document.getElementById('viewToggle');

// Menu Sanduíche
export const menuToggle = document.getElementById('menuToggle');
export const sideMenu = document.getElementById('sideMenu');
export const menuOverlay = document.getElementById('menuOverlay');
export const menuClose = document.getElementById('menuClose');
export const menuReportBtn = document.getElementById('menuReportBtn');
export const menuResetBtn = document.getElementById('menuResetBtn');
export const menuWaterBtn = document.getElementById('menuWaterBtn');
export const menuConfirmBtn = document.getElementById('menuConfirmBtn');
export const menuViewToggleBtn = document.getElementById('menuViewToggleBtn');
export const viewToggleText = document.getElementById('viewToggleText');
export const weekIndicator = document.getElementById('weekIndicator');
export const menuWeekIndicator = document.getElementById('menuWeekIndicator');
export const menuWaterCount = document.getElementById('menuWaterCount');
export const dateBadge = document.getElementById('dateBadge');
export const waterBadge = document.getElementById('waterBadge');
export const cycleBadge = document.getElementById('cycleBadge');
export const menuCycleInfo = document.getElementById('menuCycleInfo');
export const menuStartDate = document.getElementById('menuStartDate');

console.log('🔍 weekContents encontrados:', weekContents.length);
weekContents.forEach(wc => console.log(`  - ${wc.id}`));
