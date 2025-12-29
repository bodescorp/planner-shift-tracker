// ========================================
// SISTEMA DE MASCOTE VIRTUAL (PET)
// ========================================

import { Pet3DRenderer } from './pet-3d-renderer.js';

// Estados do mascote
const PET_STATES = {
    HAPPY: 'happy',
    NEUTRAL: 'neutral',
    SAD: 'sad',
    EXCITED: 'excited',
    SLEEPING: 'sleeping'
};

// Configuração de níveis
const XP_PER_LEVEL = 100;
const XP_PER_ACTIVITY = 10;

class PetSystem {
    constructor() {
        this.data = this.loadData();
        this.currentState = PET_STATES.NEUTRAL;
        this.container = null;
        this.renderer3D = null;
        this.is3DModel = false;
    }

    loadData() {
        const saved = localStorage.getItem('petData');
        if (saved) {
            const data = JSON.parse(saved);
            // Mesclar com valores padrão para garantir que todos os campos existam
            return {
                name: data.name || 'Ornn',
                level: data.level || 1,
                xp: data.xp || 0,
                totalActivitiesCompleted: data.totalActivitiesCompleted || 0,
                lastInteraction: data.lastInteraction || Date.now(),
                achievements: data.achievements || [],
                customImage: data.customImage || null,
                modelType: data.modelType || '3d',
                model3DPath: data.model3DPath || 'src/assets/ornn.glb',
                animationSettings: {
                    default: data.animationSettings?.default ?? 0,
                    onTaskComplete: data.animationSettings?.onTaskComplete ?? 0,
                    onLevelUp: data.animationSettings?.onLevelUp ?? -1,
                    onPet: data.animationSettings?.onPet ?? -1,
                    onPlay: data.animationSettings?.onPlay ?? -1,
                    onFeed: data.animationSettings?.onFeed ?? -1
                }
            };
        }
        return {
            name: 'Ornn',
            level: 1,
            xp: 0,
            totalActivitiesCompleted: 0,
            lastInteraction: Date.now(),
            achievements: [],
            customImage: null,
            modelType: '3d', // Ornn 3D por padrão
            model3DPath: 'src/assets/ornn.glb', // Modelo padrão
            animationSettings: {
                default: 0,
                onTaskComplete: 0,
                onLevelUp: -1,
                onPet: -1,
                onPlay: -1,
                onFeed: -1
            }
        };
    }

    saveData() {
        localStorage.setItem('petData', JSON.stringify(this.data));
    }

    // Adicionar XP ao mascote
    addXP(amount) {
        this.data.xp += amount;
        
        // Verificar level up
        while (this.data.xp >= this.getXPForNextLevel()) {
            this.levelUp();
        }
        
        this.saveData();
        this.updateUI();
    }

    getXPForNextLevel() {
        return this.data.level * XP_PER_LEVEL;
    }

    levelUp() {
        this.data.level++;
        this.data.xp = this.data.xp - this.getXPForNextLevel() + XP_PER_LEVEL;
        this.showLevelUpAnimation();
        
        // Reproduzir animação de level up
        const animIndex = this.data.animationSettings?.onLevelUp;
        const defaultAnimIndex = this.data.animationSettings?.default ?? 0;
        
        if (animIndex !== undefined && animIndex >= 0 && this.renderer3D) {
            this.renderer3D.playAnimation(animIndex);
            
            if (this.mainRenderer) {
                this.mainRenderer.playAnimation(animIndex);
            }
            
            const animations = this.renderer3D.getAnimations();
            if (animations[animIndex]) {
                setTimeout(() => {
                    if (this.renderer3D && defaultAnimIndex >= 0) {
                        this.renderer3D.playAnimation(defaultAnimIndex);
                    }
                    if (this.mainRenderer && defaultAnimIndex >= 0) {
                        this.mainRenderer.playAnimation(defaultAnimIndex);
                    }
                }, animations[animIndex].duration * 1000);
            }
        }
        
        // Notificar usuário
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`🎉 Level Up!`, {
                body: `${this.data.name} chegou ao nível ${this.data.level}!`,
                icon: 'src/assets/icon-192.svg'
            });
        }
    }

    // Registrar atividade completada
    onActivityCompleted() {
        this.data.totalActivitiesCompleted++;
        this.addXP(XP_PER_ACTIVITY);
        
        // Reproduzir animação configurada
        const animIndex = this.data.animationSettings?.onTaskComplete;
        const defaultAnimIndex = this.data.animationSettings?.default ?? 0;
        
        if (animIndex !== undefined && animIndex >= 0 && this.renderer3D) {
            // Animar na aba do mascote
            this.renderer3D.playAnimation(animIndex);
            
            // Animar no widget principal
            if (this.mainRenderer) {
                this.mainRenderer.playAnimation(animIndex);
            }
            
            // Voltar à animação padrão após animação
            const animations = this.renderer3D.getAnimations();
            if (animations[animIndex]) {
                setTimeout(() => {
                    // Voltar para animação padrão
                    if (this.renderer3D && defaultAnimIndex >= 0) {
                        this.renderer3D.playAnimation(defaultAnimIndex);
                    }
                    if (this.mainRenderer && defaultAnimIndex >= 0) {
                        this.mainRenderer.playAnimation(defaultAnimIndex);
                    }
                }, animations[animIndex].duration * 1000);
            }
        } else {
            this.setState(PET_STATES.EXCITED);
            setTimeout(() => {
                this.setState(PET_STATES.HAPPY);
            }, 3000);
        }
    }

    // Definir estado do mascote
    setState(state) {
        this.currentState = state;
        
        if (this.is3DModel && this.renderer3D) {
            this.renderer3D.setEmotionEffect(state);
        } else {
            this.updatePetVisual();
        }
    }

    // Interagir com o mascote
    interact(action) {
        this.data.lastInteraction = Date.now();
        
        let animKey = null;
        let message = '';
        
        switch(action) {
            case 'pet':
                animKey = 'onPet';
                message = '😊 Que carinho gostoso!';
                break;
            case 'play':
                animKey = 'onPlay';
                message = '🎮 Vamos brincar!';
                break;
            case 'feed':
                this.addXP(5);
                animKey = 'onFeed';
                message = '😋 Obrigado!';
                break;
        }
        
        // Reproduzir animação configurada
        const animIndex = this.data.animationSettings?.[animKey];
        const defaultAnimIndex = this.data.animationSettings?.default ?? 0;
        
        if (animIndex !== undefined && animIndex >= 0 && this.renderer3D) {
            this.renderer3D.playAnimation(animIndex);
            this.showMessage(message);
            
            // Animar também no widget principal
            if (this.mainRenderer) {
                this.mainRenderer.playAnimation(animIndex);
            }
            
            // Voltar à animação padrão
            const animations = this.renderer3D.getAnimations();
            if (animations[animIndex]) {
                setTimeout(() => {
                    if (this.renderer3D && defaultAnimIndex >= 0) {
                        this.renderer3D.playAnimation(defaultAnimIndex);
                    }
                    if (this.mainRenderer && defaultAnimIndex >= 0) {
                        this.mainRenderer.playAnimation(defaultAnimIndex);
                    }
                }, animations[animIndex].duration * 1000);
            }
        } else {
            // Fallback para estados padrão
            if (action === 'pet') this.setState(PET_STATES.HAPPY);
            if (action === 'play') this.setState(PET_STATES.EXCITED);
            if (action === 'feed') this.setState(PET_STATES.HAPPY);
            this.showMessage(message);
            
            setTimeout(() => {
                this.setState(PET_STATES.NEUTRAL);
            }, 3000);
        }
        
        this.saveData();
    }

    // Criar interface do mascote (minimalista)
    createUI() {
        const container = document.createElement('div');
        container.id = 'petPage';
        container.className = 'page-content pet-page';
        container.style.display = 'none';
        container.innerHTML = `
            <div class="pet-minimal-container">
                <!-- Stats compactos -->
                <div class="pet-stats-minimal">
                    <div class="stat-badge">
                        <span class="stat-icon">⚡</span>
                        <span class="stat-text">Nv.<strong id="petLevel">${this.data.level}</strong></span>
                    </div>
                    <div class="stat-badge">
                        <span class="stat-icon">✨</span>
                        <span class="stat-text"><strong id="petXP">${this.data.xp}</strong>/${this.getXPForNextLevel()}</span>
                    </div>
                    <div class="stat-badge">
                        <span class="stat-icon">🎯</span>
                        <span class="stat-text"><strong id="petActivities">${this.data.totalActivitiesCompleted}</strong></span>
                    </div>
                </div>

                <!-- Barra XP -->
                <div class="pet-xp-bar-minimal">
                    <div class="pet-xp-fill" id="petXPFill" style="width: ${(this.data.xp / this.getXPForNextLevel()) * 100}%"></div>
                </div>

                <!-- Mascote no Centro -->
                <div class="pet-display-minimal" id="petDisplay">
                    <div class="pet-message" id="petMessage"></div>
                    <div class="pet-character-wrapper">
                        <div class="pet-character" id="petCharacter">
                            ${this.getCustomPetImage() || this.getPetSVG()}
                        </div>
                    </div>
                    <div class="pet-name-editable" id="petNameDisplay">${this.data.name}</div>
                </div>

                <!-- Ações minimalistas -->
                <div class="pet-actions-minimal">
                    <button class="pet-action-btn-minimal" data-action="pet" title="Fazer Carinho">
                        🤗
                    </button>
                    <button class="pet-action-btn-minimal" data-action="play" title="Brincar">
                        🎮
                    </button>
                    <button class="pet-action-btn-minimal" data-action="feed" title="Alimentar">
                        🍪
                    </button>
                </div>

                <!-- Conquistas compactas -->
                <details class="pet-achievements-minimal">
                    <summary>🏆 Conquistas (${this.getUnlockedCount()})</summary>
                    <div class="achievements-list-minimal" id="achievementsList">
                        ${this.renderAchievements()}
                    </div>
                </details>
            </div>
        `;

        this.container = container;
        this.attachEventListeners();
        
        // Carregar Ornn automaticamente
        const modelPath = this.data.model3DPath || 'src/assets/ornn.glb';
        if (this.data.modelType === '3d') {
            // Aguardar um pouco para o DOM estar pronto
            setTimeout(() => {
                this.init3DModel(modelPath);
            }, 100);
        }
        
        return container;
    }

    attachEventListeners() {
        // Botões de ação
        const actionButtons = this.container.querySelectorAll('.pet-action-btn-minimal[data-action]');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.interact(action);
            });
        });

        // Ornn é o mascote padrão - sem upload necessário

        // Editar nome (click no nome)
        const nameDisplay = this.container.querySelector('#petNameDisplay');
        nameDisplay?.addEventListener('click', () => {
            const newName = prompt('Nome do mascote:', this.data.name);
            if (newName && newName.trim()) {
                this.data.name = newName.trim();
                this.saveData();
                nameDisplay.textContent = this.data.name;
                this.showMessage(`Agora eu me chamo ${this.data.name}! 😊`);
            }
        });

        // Click no mascote
        const petCharacter = this.container.querySelector('#petCharacter');
        petCharacter?.addEventListener('click', () => {
            this.interact('pet');
        });
    }

    async init3DModel(modelPath) {
        const petCharacter = this.container.querySelector('#petCharacter');
        if (!petCharacter) return;
        
        // Verificar se já foi inicializado ou está carregando
        if (this.renderer3D && this.is3DModel) return;
        if (this.isLoading3DModel) return; // Evitar chamadas duplicadas
        
        this.isLoading3DModel = true;
        
        // Limpar conteúdo anterior (SVG ou imagem) antes de carregar o modelo 3D
        petCharacter.innerHTML = '';
        
        // Criar renderer 3D se não existir
        if (!this.renderer3D) {
            const { Pet3DRenderer } = await import('./pet-3d-renderer.js');
            this.renderer3D = new Pet3DRenderer(petCharacter);
            await this.renderer3D.init();
        }
        
        // Carregar modelo
        const success = await this.renderer3D.loadModel(modelPath);
        if (success) {
            this.is3DModel = true;
            this.isLoading3DModel = false;
            petCharacter.classList.add('model-3d');
            
            // Aplicar animação padrão se configurada
            const defaultAnim = this.data.animationSettings?.default ?? 0;
            if (defaultAnim >= 0) {
                setTimeout(() => {
                    this.renderer3D.playAnimation(defaultAnim);
                }, 100);
            }
            
            // Atualizar lista de animações
            this.updateAnimationsList();
            
            // Popular configurações de animação com valores salvos
            const animations = this.renderer3D.getAnimations();
            if (animations && animations.length > 0) {
                this.populateAnimationSettings(animations);
            }
        } else {
            this.isLoading3DModel = false;
        }
    }

    updateAnimationsList() {
        if (!this.renderer3D) return;
        
        const animations = this.renderer3D.getAnimations();
        const animationControls = this.container.querySelector('#animationControls');
        const animationList = this.container.querySelector('#animationList');
        
        if (!animationControls || !animationList) return;
        
        if (animations.length === 0) {
            animationControls.style.display = 'none';
            return;
        }
        
        animationControls.style.display = 'block';
        
        // Criar lista de animações
        animationList.innerHTML = animations.map((clip, index) => `
            <button class="animation-item" data-index="${index}">
                <span class="animation-number">${index + 1}</span>
                <span class="animation-name">${clip.name || `Animação ${index + 1}`}</span>
                <span class="animation-duration">${clip.duration.toFixed(1)}s</span>
            </button>
        `).join('');
        
        // Adicionar event listeners
        const animationItems = animationList.querySelectorAll('.animation-item');
        animationItems.forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.renderer3D.playAnimation(index);
                
                // Highlight ativo
                animationItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                this.showMessage(`🎬 Reproduzindo: ${animations[index].name || `Animação ${index + 1}`}`);
            });
        });
        
        // Marcar primeira como ativa
        if (animationItems.length > 0) {
            animationItems[0].classList.add('active');
        }
        
        // Botão de play/pause
        const toggleBtn = this.container.querySelector('#animationToggle');
        if (toggleBtn) {
            toggleBtn.onclick = () => {
                const isPlaying = this.renderer3D.toggleAnimations();
                toggleBtn.textContent = isPlaying ? '⏸️' : '▶️';
            };
        }
        
        // Popular selects de configuração
        this.populateAnimationSettings(animations);
    }

    populateAnimationSettings(animations) {
        if (!animations || animations.length === 0) return;
        
        const settings = this.data.animationSettings || {};
        
        const selects = [
            { id: 'animDefault', key: 'default' },
            { id: 'animOnTaskComplete', key: 'onTaskComplete' },
            { id: 'animOnLevelUp', key: 'onLevelUp' },
            { id: 'animOnPet', key: 'onPet' },
            { id: 'animOnPlay', key: 'onPlay' },
            { id: 'animOnFeed', key: 'onFeed' }
        ];
        
        selects.forEach(({ id, key }) => {
            // Buscar select tanto na aba quanto no modal
            const select = document.querySelector(`#${id}`);
            if (!select) return;
            
            // Popular opções
            select.innerHTML = '<option value="-1">Nenhuma</option>' + 
                animations.map((clip, index) => 
                    `<option value="${index}">${clip.name || `Animação ${index + 1}`}</option>`
                ).join('');
            
            // Definir valor salvo
            if (settings[key] !== undefined) {
                select.value = settings[key];
            }
            
            // Remover listeners antigos e adicionar novo
            const newSelect = select.cloneNode(true);
            select.parentNode.replaceChild(newSelect, select);
            
            newSelect.addEventListener('change', () => {
                if (!this.data.animationSettings) {
                    this.data.animationSettings = {};
                }
                const animIndex = parseInt(newSelect.value);
                this.data.animationSettings[key] = animIndex;
                this.saveData();
                
                // Se for animação padrão, aplicar imediatamente
                if (key === 'default' && animIndex >= 0) {
                    if (this.renderer3D) {
                        this.renderer3D.playAnimation(animIndex);
                    }
                    if (this.mainRenderer) {
                        this.mainRenderer.playAnimation(animIndex);
                    }
                }
                
                // Mostrar feedback
                const modal = document.getElementById('petSettingsModal');
                if (modal && modal.style.display !== 'none') {
                    // Feedback no modal
                    const note = modal.querySelector('.settings-note p');
                    if (note) {
                        const originalText = note.innerHTML;
                        note.innerHTML = '✅ <strong>Configuração salva com sucesso!</strong>';
                        note.style.color = '#10b981';
                        setTimeout(() => {
                            note.innerHTML = originalText;
                            note.style.color = '';
                        }, 2000);
                    }
                } else if (this.container) {
                    this.showMessage('⚙️ Configuração salva!');
                }
            });
        });
    }

    updateUI() {
        if (!this.container) return;

        const levelEl = this.container.querySelector('#petLevel');
        const xpEl = this.container.querySelector('#petXP');
        const activitiesEl = this.container.querySelector('#petActivities');
        const xpFillEl = this.container.querySelector('#petXPFill');

        if (levelEl) levelEl.textContent = this.data.level;
        if (xpEl) xpEl.textContent = `${this.data.xp}/${this.getXPForNextLevel()}`;
        if (activitiesEl) activitiesEl.textContent = this.data.totalActivitiesCompleted;
        if (xpFillEl) {
            const percentage = (this.data.xp / this.getXPForNextLevel()) * 100;
            xpFillEl.style.width = `${percentage}%`;
        }

        // Atualizar conquistas
        const achievementsEl = this.container.querySelector('#achievementsList');
        if (achievementsEl) {
            achievementsEl.innerHTML = this.renderAchievements();
        }
    }

    updatePetVisual() {
        if (!this.container) return;
        
        // Se for modelo 3D, não atualizar (já renderizado)
        if (this.is3DModel) return;
        
        const petCharacter = this.container.querySelector('#petCharacter');
        if (petCharacter) {
            petCharacter.innerHTML = this.getCustomPetImage() || this.getPetSVG();
            petCharacter.className = `pet-character pet-state-${this.currentState}`;
        }
    }

    showMessage(text) {
        if (!this.container) return;
        
        const messageEl = this.container.querySelector('#petMessage');
        if (messageEl) {
            messageEl.textContent = text;
            messageEl.classList.add('visible');
            
            setTimeout(() => {
                messageEl.classList.remove('visible');
            }, 3000);
        }
    }

    showLevelUpAnimation() {
        if (!this.container) return;
        
        const petDisplay = this.container.querySelector('#petDisplay');
        if (petDisplay) {
            petDisplay.classList.add('level-up');
            this.showMessage(`🎉 Level UP! Agora sou nível ${this.data.level}!`);
            
            setTimeout(() => {
                petDisplay.classList.remove('level-up');
            }, 2000);
        }
    }

    renderAchievements() {
        const achievements = this.checkAchievements();
        
        return achievements.map(achievement => `
            <div class="achievement-item-minimal ${achievement.unlocked ? 'unlocked' : 'locked'}">
                <span class="achievement-icon-minimal">${achievement.icon}</span>
                <div class="achievement-info-minimal">
                    <div class="achievement-name-minimal">${achievement.name}</div>
                    <div class="achievement-desc-minimal">${achievement.description}</div>
                </div>
                ${achievement.unlocked ? '<span class="achievement-check">✔️</span>' : ''}
            </div>
        `).join('');
    }

    checkAchievements() {
        return [
            {
                icon: '🌟',
                name: 'Primeira Atividade',
                description: 'Complete sua primeira atividade',
                unlocked: this.data.totalActivitiesCompleted >= 1
            },
            {
                icon: '🔥',
                name: 'Em Chamas',
                description: 'Complete 10 atividades',
                unlocked: this.data.totalActivitiesCompleted >= 10
            },
            {
                icon: '💪',
                name: 'Dedicado',
                description: 'Complete 50 atividades',
                unlocked: this.data.totalActivitiesCompleted >= 50
            },
            {
                icon: '🏆',
                name: 'Mestre',
                description: 'Complete 100 atividades',
                unlocked: this.data.totalActivitiesCompleted >= 100
            },
            {
                icon: '⚡',
                name: 'Nível 5',
                description: 'Alcance o nível 5',
                unlocked: this.data.level >= 5
            },
            {
                icon: '💎',
                name: 'Nível 10',
                description: 'Alcance o nível 10',
                unlocked: this.data.level >= 10
            }
        ];
    }

    getUnlockedCount() {
        return this.checkAchievements().filter(a => a.unlocked).length;
    }

    getCustomPetImage() {
        if (this.data.customImage) {
            return `<img src="${this.data.customImage}" alt="${this.data.name}" class="pet-custom-image" />`;
        }
        return null;
    }

    getPetSVG() {
        const color = this.getPetColor();
        const expression = this.getExpression();

        return `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <!-- Corpo -->
                <ellipse cx="100" cy="120" rx="60" ry="50" fill="${color}" opacity="0.9"/>
                
                <!-- Cabeça -->
                <circle cx="100" cy="70" r="45" fill="${color}"/>
                
                <!-- Orelhas -->
                <ellipse cx="70" cy="45" rx="15" ry="25" fill="${color}" opacity="0.8"/>
                <ellipse cx="130" cy="45" rx="15" ry="25" fill="${color}" opacity="0.8"/>
                
                <!-- Olhos -->
                <circle cx="85" cy="65" r="8" fill="#2a2a2a"/>
                <circle cx="115" cy="65" r="8" fill="#2a2a2a"/>
                <circle cx="87" cy="63" r="3" fill="white"/>
                <circle cx="117" cy="63" r="3" fill="white"/>
                
                <!-- Expressão -->
                ${expression}
                
                <!-- Braços -->
                <ellipse cx="60" cy="110" rx="12" ry="30" fill="${color}" opacity="0.8"/>
                <ellipse cx="140" cy="110" rx="12" ry="30" fill="${color}" opacity="0.8"/>
                
                <!-- Pernas -->
                <ellipse cx="80" cy="155" rx="15" ry="20" fill="${color}" opacity="0.8"/>
                <ellipse cx="120" cy="155" rx="15" ry="20" fill="${color}" opacity="0.8"/>
                
                <!-- Detalhe de barriga -->
                <ellipse cx="100" cy="125" rx="35" ry="30" fill="white" opacity="0.3"/>
            </svg>
        `;
    }

    getPetColor() {
        // Cor muda com o nível
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
        return colors[this.data.level % colors.length];
    }

    getExpression() {
        switch(this.currentState) {
            case PET_STATES.HAPPY:
                return '<path d="M 85 85 Q 100 95 115 85" stroke="#2a2a2a" stroke-width="3" fill="none" stroke-linecap="round"/>';
            case PET_STATES.EXCITED:
                return `
                    <path d="M 85 85 Q 100 95 115 85" stroke="#2a2a2a" stroke-width="3" fill="none" stroke-linecap="round"/>
                    <circle cx="75" cy="80" r="3" fill="#ff6b6b"/>
                    <circle cx="125" cy="80" r="3" fill="#ff6b6b"/>
                `;
            case PET_STATES.SAD:
                return '<path d="M 85 90 Q 100 85 115 90" stroke="#2a2a2a" stroke-width="3" fill="none" stroke-linecap="round"/>';
            case PET_STATES.SLEEPING:
                return `
                    <line x1="78" y1="65" x2="92" y2="65" stroke="#2a2a2a" stroke-width="3" stroke-linecap="round"/>
                    <line x1="108" y1="65" x2="122" y2="65" stroke="#2a2a2a" stroke-width="3" stroke-linecap="round"/>
                `;
            default:
                return '<line x1="85" y1="85" x2="115" y2="85" stroke="#2a2a2a" stroke-width="3" stroke-linecap="round"/>';
        }
    }
}

// Instância global
let petSystem = null;

export function initPetSystem() {
    petSystem = new PetSystem();
    return petSystem;
}

export function getPetSystem() {
    return petSystem;
}

export function createPetContent() {
    if (!petSystem) {
        petSystem = new PetSystem();
    }
    return petSystem.createUI();
}

export function notifyActivityCompleted() {
    if (petSystem) {
        petSystem.onActivityCompleted();
    }
}

export function ensurePetModelLoaded() {
    if (petSystem && petSystem.data.modelType === '3d') {
        const modelPath = petSystem.data.model3DPath || 'src/assets/ornn.glb';
        petSystem.init3DModel(modelPath);
    }
}

export function initMainPetWidget() {
    if (!petSystem) {
        setTimeout(() => initMainPetWidget(), 500);
        return;
    }
    
    const mainPetCharacter = document.getElementById('mainPetCharacter');
    
    if (!mainPetCharacter) {
        return;
    }
    
    // Verificar se o elemento está visível (importante para desktop-only)
    const isVisible = mainPetCharacter.offsetParent !== null;
    if (!isVisible) {
        setTimeout(() => initMainPetWidget(), 300);
        return;
    }
    
    // Importar Pet3DRenderer dinamicamente
    import('./pet-3d-renderer.js').then(module => {
        const { Pet3DRenderer } = module;
        const miniRenderer = new Pet3DRenderer(mainPetCharacter);
        
        // Definir animação padrão antes de carregar
        miniRenderer.defaultAnimIndex = petSystem.data.animationSettings?.default ?? 0;
        
        miniRenderer.init().then(() => {
            miniRenderer.loadModel('src/assets/ornn.glb').then(() => {
                // Aplicar animação padrão após carregar
                const defaultAnim = petSystem.data.animationSettings?.default ?? 0;
                if (defaultAnim >= 0) {
                    setTimeout(() => {
                        miniRenderer.playAnimation(defaultAnim);
                    }, 100);
                }
            }).catch(() => {});
        }).catch(() => {});
        
        // Guardar referência
        if (petSystem) {
            petSystem.mainRenderer = miniRenderer;
        }
    }).catch(() => {});
}

export function updateMainPetWidget() {
    // Widget simplificado - apenas animação
}

export function openPetSettingsModal() {
    const modal = document.getElementById('petSettingsModal');
    if (!modal) return;
    
    modal.style.display = 'flex';
    
    // Popular settings se tiver animações
    if (petSystem && petSystem.renderer3D) {
        const animations = petSystem.renderer3D.getAnimations();
        if (animations && animations.length > 0) {
            petSystem.populateAnimationSettings(animations);
        }
    }
}

export function closePetSettingsModal() {
    const modal = document.getElementById('petSettingsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}
