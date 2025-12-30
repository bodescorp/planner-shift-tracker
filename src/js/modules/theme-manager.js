/**
 * Módulo de Theme Manager
 * Gerencia temas dark/light e customizações
 */

export class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.fontScale = parseFloat(localStorage.getItem('fontScale')) || 1;
        this.density = localStorage.getItem('density') || 'comfortable';
        
        this.init();
    }

    init() {
        this.applyTheme();
        this.applyFontScale();
        this.applyDensity();
        this.createThemeControls();
    }

    createThemeControls() {
        // Adicionar controles no menu
        const menuInfoGroup = document.querySelector('.menu-info-group');
        if (!menuInfoGroup) return;

        const themeControls = document.createElement('div');
        themeControls.className = 'theme-controls';
        themeControls.innerHTML = `
            <div class="theme-section">
                <h4 class="theme-section-title">Aparência</h4>
                
                <div class="theme-control">
                    <label class="theme-label">
                        <span>Tema</span>
                        <select id="theme-selector" class="theme-select">
                            <option value="dark" ${this.currentTheme === 'dark' ? 'selected' : ''}>Escuro</option>
                            <option value="light" ${this.currentTheme === 'light' ? 'selected' : ''}>Claro</option>
                            <option value="auto" ${this.currentTheme === 'auto' ? 'selected' : ''}>Automático</option>
                        </select>
                    </label>
                </div>

                <div class="theme-control">
                    <label class="theme-label">
                        <span>Tamanho do texto</span>
                        <input 
                            type="range" 
                            id="font-scale-slider" 
                            class="theme-slider"
                            min="0.85" 
                            max="1.3" 
                            step="0.05" 
                            value="${this.fontScale}"
                        />
                        <span class="theme-value">${Math.round(this.fontScale * 100)}%</span>
                    </label>
                </div>

                <div class="theme-control">
                    <label class="theme-label">
                        <span>Densidade</span>
                        <select id="density-selector" class="theme-select">
                            <option value="compact" ${this.density === 'compact' ? 'selected' : ''}>Compacto</option>
                            <option value="comfortable" ${this.density === 'comfortable' ? 'selected' : ''}>Confortável</option>
                            <option value="spacious" ${this.density === 'spacious' ? 'selected' : ''}>Espaçoso</option>
                        </select>
                    </label>
                </div>

                <button class="theme-reset-btn" id="reset-theme">
                    Restaurar padrão
                </button>
            </div>
        `;

        menuInfoGroup.before(themeControls);
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Theme selector
        const themeSelector = document.getElementById('theme-selector');
        themeSelector?.addEventListener('change', (e) => {
            this.setTheme(e.target.value);
            window.toast.success('Tema alterado');
        });

        // Font scale
        const fontScaleSlider = document.getElementById('font-scale-slider');
        const fontScaleValue = document.querySelector('.theme-value');
        fontScaleSlider?.addEventListener('input', (e) => {
            this.fontScale = parseFloat(e.target.value);
            fontScaleValue.textContent = `${Math.round(this.fontScale * 100)}%`;
            this.applyFontScale();
            localStorage.setItem('fontScale', this.fontScale);
        });

        // Density
        const densitySelector = document.getElementById('density-selector');
        densitySelector?.addEventListener('change', (e) => {
            this.setDensity(e.target.value);
            window.toast.success('Densidade alterada');
        });

        // Reset
        document.getElementById('reset-theme')?.addEventListener('click', () => {
            this.reset();
            window.toast.info('Configurações restauradas');
        });
    }

    setTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.applyTheme();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        // Auto theme baseado em preferência do sistema
        if (this.currentTheme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        }
    }

    applyFontScale() {
        // Aplicar escala em todo o documento
        document.documentElement.style.fontSize = `${this.fontScale * 16}px`;
        
        // Adicionar classe para ajustes adicionais se necessário
        document.body.setAttribute('data-font-scale', this.fontScale);
    }

    setDensity(density) {
        this.density = density;
        localStorage.setItem('density', density);
        this.applyDensity();
    }

    applyDensity() {
        document.documentElement.setAttribute('data-density', this.density);
        
        // Aplicar densidade via CSS custom properties
        const spacingMultipliers = {
            compact: 0.75,
            comfortable: 1,
            spacious: 1.25
        };
        
        const multiplier = spacingMultipliers[this.density] || 1;
        document.documentElement.style.setProperty('--spacing-multiplier', multiplier);
        
        // Aplicar estilos diretamente nos elementos principais
        const dayCards = document.querySelectorAll('.day-card');
        dayCards.forEach(card => {
            card.style.padding = `${32 * multiplier}px 0`;
        });
        
        const activities = document.querySelectorAll('.activity');
        activities.forEach(activity => {
            activity.style.padding = `${16 * multiplier}px 0`;
        });
        
        const dayHeaders = document.querySelectorAll('.day-header');
        dayHeaders.forEach(header => {
            header.style.marginBottom = `${24 * multiplier}px`;
        });
    }

    reset() {
        this.setTheme('dark');
        this.fontScale = 1;
        this.setDensity('comfortable');
        
        document.getElementById('theme-selector').value = 'dark';
        document.getElementById('font-scale-slider').value = 1;
        document.querySelector('.theme-value').textContent = '100%';
        document.getElementById('density-selector').value = 'comfortable';
        
        this.applyFontScale();
    }
}

// CSS para Theme Manager
const themeStyles = `
/* Light Theme */
[data-theme="light"] {
    --bg-primary: #ffffff;
    --text-primary: #000000;
    --text-secondary: rgba(0, 0, 0, 0.75);
    --text-tertiary: rgba(0, 0, 0, 0.5);
    --border-subtle: rgba(0, 0, 0, 0.08);
    --border-medium: rgba(0, 0, 0, 0.15);
}

[data-theme="light"] body {
    background: var(--bg-primary);
    color: var(--text-primary);
}

[data-theme="light"] .side-menu {
    background: rgba(255, 255, 255, 0.98);
}

[data-theme="light"] .day-card {
    border-top-color: rgba(0, 0, 0, 0.06);
}

[data-theme="light"] .menu-toggle {
    background: rgba(0, 0, 0, 0.03);
    border-color: rgba(0, 0, 0, 0.08);
}

[data-theme="light"] .menu-toggle span {
    background: rgba(0, 0, 0, 0.7);
}

/* Density Variations */
[data-density="compact"] {
    --spacing-unit: 0.75;
}

[data-density="comfortable"] {
    --spacing-unit: 1;
}

[data-density="spacious"] {
    --spacing-unit: 1.25;
}

[data-density="compact"] .day-card {
    padding: calc(24px * var(--spacing-unit)) 0;
}

[data-density="compact"] .activity {
    padding: calc(16px * var(--spacing-unit)) 0;
}

[data-density="compact"] .day-header {
    margin-bottom: calc(24px * var(--spacing-unit));
}

/* Theme Controls */
.theme-controls {
    padding: 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.theme-section-title {
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.7rem;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 16px;
}

.theme-control {
    margin-bottom: 20px;
}

.theme-label {
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    font-weight: 300;
}

.theme-label > span:first-child {
    font-size: 0.85rem;
}

.theme-select {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 6px;
    padding: 10px 12px;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.9rem;
    font-weight: 300;
    cursor: pointer;
    outline: none;
    transition: all 0.2s;
}

.theme-select:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.12);
}

.theme-select:focus {
    border-color: rgba(255, 255, 255, 0.2);
}

.theme-slider {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 2px;
    outline: none;
    -webkit-appearance: none;
    appearance: none;
}

.theme-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s;
}

.theme-slider::-webkit-slider-thumb:hover {
    background: #ffffff;
    transform: scale(1.2);
}

.theme-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    cursor: pointer;
    border: none;
}

.theme-value {
    text-align: center;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.6);
    margin-top: 4px;
}

.theme-reset-btn {
    width: 100%;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 6px;
    padding: 10px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.85rem;
    font-weight: 300;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 20px;
}

.theme-reset-btn:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.9);
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = themeStyles;
document.head.appendChild(styleSheet);

export default ThemeManager;
