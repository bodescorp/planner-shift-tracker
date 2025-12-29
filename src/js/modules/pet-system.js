// ========================================
// SISTEMA DE MASCOTE VIRTUAL (PET)
// ========================================

import { Pet3DRenderer } from './pet-3d-renderer.js';
import { loadChampionAbilities, getAbilitiesForPetActions } from './champion-abilities.js';

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
        this.championAbilities = null;
        // Carregar habilidades do campeão
        this.loadChampionData();
    }

    async loadChampionData() {
        try {
            await loadChampionAbilities('Ornn');
            this.championAbilities = getAbilitiesForPetActions();
            // Atualizar UI com os ícones das habilidades
            this.updateAbilityIcons();
        } catch (error) {
            console.error('Erro ao carregar habilidades do campeão:', error);
        }
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
                modelType: '3d',
                model3DPath: data.model3DPath || 'src/assets/ornn.glb',
                animationSettings: {
                    default: data.animationSettings?.default ?? 0,
                    onTaskComplete: data.animationSettings?.onTaskComplete ?? 0,
                    onLevelUp: data.animationSettings?.onLevelUp ?? -1,
                    onPassive: data.animationSettings?.onPassive ?? -1,
                    onQ: data.animationSettings?.onQ ?? -1,
                    onW: data.animationSettings?.onW ?? -1,
                    onE: data.animationSettings?.onE ?? -1,
                    onR: data.animationSettings?.onR ?? -1
                },
                animOnClick: data.animOnClick ?? -1 // -1 = nenhuma animação
            };
        }
        return {
            name: 'Ornn',
            level: 1,
            xp: 0,
            totalActivitiesCompleted: 0,
            lastInteraction: Date.now(),
            achievements: [],
            modelType: '3d',
            model3DPath: 'src/assets/ornn.glb',
            animationSettings: {
                default: -1,
                onTaskComplete: -1,
                onLevelUp: -1,
                onPassive: -1,
                onQ: -1,
                onW: -1,
                onE: -1,
                onR: -1
            },
            animationBehavior: {
                returnToDefault: true,
                fadeDuration: 0.2,
                speed: 1.0,
                abilityLoop: 'once'
            },
            animOnClick: -1 // -1 = nenhuma animação
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
        const defaultAnimIndex = this.data.animationSettings?.default ?? -1;
        
        if (animIndex !== undefined && animIndex >= 0 && this.renderer3D) {
            this.renderer3D.playAnimation(animIndex);
            
            if (this.mainRenderer) {
                this.mainRenderer.playAnimation(animIndex);
            }
            
            const animations = this.renderer3D.getAnimations();
            if (animations[animIndex]) {
                setTimeout(() => {
                    if (this.renderer3D && defaultAnimIndex >= 0) {
                        this.renderer3D.playAnimation(defaultAnimIndex, 'repeat');
                    }
                    if (this.mainRenderer && defaultAnimIndex >= 0) {
                        this.mainRenderer.playAnimation(defaultAnimIndex, 'repeat');
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
        const defaultAnimIndex = this.data.animationSettings?.default ?? -1;
        
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
                        this.renderer3D.playAnimation(defaultAnimIndex, 'repeat');
                    }
                    if (this.mainRenderer && defaultAnimIndex >= 0) {
                        this.mainRenderer.playAnimation(defaultAnimIndex, 'repeat');
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

    // Definir estado do mascote (apenas para efeitos 3D)
    setState(state) {
        this.currentState = state;
        
        if (this.is3DModel && this.renderer3D) {
            this.renderer3D.setEmotionEffect(state);
        }
    }

    // Interagir com o mascote
    onMascotClick() {
        // Evitar múltiplos cliques simultâneos
        if (this.isPlayingClickAnimation) return;
        
        const animIndex = this.data.animOnClick ?? -1;
        
        // Se não há animação configurada, não fazer nada
        if (animIndex < 0) return;
        
        this.isPlayingClickAnimation = true;
        const defaultAnimIndex = this.data.animationSettings?.default ?? -1;
        
        // Limpar timeouts anteriores
        if (this.clickAnimTimeout) {
            clearTimeout(this.clickAnimTimeout);
            this.clickAnimTimeout = null;
        }
        if (this.clickAnimTimeoutMain) {
            clearTimeout(this.clickAnimTimeoutMain);
            this.clickAnimTimeoutMain = null;
        }
        
        // Reproduzir animação uma vez
        if (this.renderer3D) {
            this.renderer3D.playAnimation(animIndex, 'once');
            
            // Voltar à animação padrão após a duração
            const animations = this.renderer3D.getAnimations();
            if (animations[animIndex]) {
                const duration = animations[animIndex].duration || 2;
                this.clickAnimTimeout = setTimeout(() => {
                    if (this.renderer3D && defaultAnimIndex >= 0) {
                        this.renderer3D.playAnimation(defaultAnimIndex, 'repeat');
                    }
                    this.isPlayingClickAnimation = false;
                }, duration * 1000);
            }
        }
        
        if (this.mainRenderer) {
            this.mainRenderer.playAnimation(animIndex, 'once');
            
            // Voltar à animação padrão após a duração
            const animations = this.mainRenderer.getAnimations();
            if (animations[animIndex]) {
                const duration = animations[animIndex].duration || 2;
                this.clickAnimTimeoutMain = setTimeout(() => {
                    if (this.mainRenderer && defaultAnimIndex >= 0) {
                        this.mainRenderer.playAnimation(defaultAnimIndex, 'repeat');
                    }
                }, duration * 1000);
            }
        }
        
        // Mostrar mensagem
        this.showMessage('🐾 Carinho!');
    }

    interact(action) {
        this.data.lastInteraction = Date.now();
        
        let animKey = null;
        let message = '';
        
        switch(action) {
            case 'passive':
                this.addXP(5);
                animKey = 'onPassive';
                message = '⚒️ Forja Viva!';
                break;
            case 'q':
                this.addXP(3);
                animKey = 'onQ';
                message = '🌋 Ruptura Vulcânica!';
                break;
            case 'w':
                this.addXP(3);
                animKey = 'onW';
                message = '🔥 Sopro do Fole!';
                break;
            case 'e':
                this.addXP(3);
                animKey = 'onE';
                message = '⚡ Investida Ardente!';
                break;
            case 'r':
                this.addXP(5);
                animKey = 'onR';
                message = '🔨 Chamado do Deus Forjador!';
                break;
        }
        
        // Mostrar mensagem
        this.showMessage(message);
        
        // Reproduzir animação configurada
        if (this.renderer3D && this.is3DModel) {
            const animIndex = this.data.animationSettings?.[animKey];
            const defaultAnimIndex = this.data.animationSettings?.default ?? -1;
            const animations = this.renderer3D.getAnimations();
            
            // Se tem animação configurada para esta habilidade
            if (animIndex !== undefined && animIndex >= 0 && animations[animIndex]) {
                this.renderer3D.playAnimation(animIndex, 'once');
                
                // Animar também no widget principal
                if (this.mainRenderer) {
                    this.mainRenderer.playAnimation(animIndex, 'once');
                }
                
                // Voltar à animação padrão após a duração
                const duration = animations[animIndex].duration || 2;
                setTimeout(() => {
                    if (this.renderer3D && defaultAnimIndex >= 0) {
                        this.renderer3D.playAnimation(defaultAnimIndex, 'repeat');
                    }
                    if (this.mainRenderer && defaultAnimIndex >= 0) {
                        this.mainRenderer.playAnimation(defaultAnimIndex, 'repeat');
                    }
                }, duration * 1000);
            }
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
                            <!-- Modelo 3D será carregado aqui -->
                        </div>
                    </div>
                    <div class="pet-name-editable" id="petNameDisplay">${this.data.name}</div>
                </div>

                <!-- Ações minimalistas -->
                <div class="pet-actions-minimal" id="petActionsContainer">
                    <button class="pet-action-btn-minimal" data-action="passive" title="Passiva">
                        ⭐
                    </button>
                    <button class="pet-action-btn-minimal" data-action="q" title="Habilidade Q">
                        🔥
                    </button>
                    <button class="pet-action-btn-minimal" data-action="w" title="Habilidade W">
                        💨
                    </button>
                    <button class="pet-action-btn-minimal" data-action="e" title="Habilidade E">
                        ⚡
                    </button>
                    <button class="pet-action-btn-minimal" data-action="r" title="Habilidade R">
                        💥
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
        
        // Carregar Ornn automaticamente quando a aba estiver visível
        const modelPath = this.data.model3DPath || 'src/assets/ornn.glb';
        
        // Carregar modelo imediatamente (será carregado quando a aba for exibida)
        setTimeout(() => {
            if (this.container && this.container.style.display !== 'none') {
                this.init3DModel(modelPath);
            } else {
                // Observar mudanças de visibilidade
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.attributeName === 'style' && 
                            this.container.style.display !== 'none' && 
                            !this.is3DModel && !this.isLoading3DModel) {
                            this.init3DModel(modelPath);
                            observer.disconnect();
                        }
                    });
                });
                observer.observe(this.container, { attributes: true, attributeFilter: ['style'] });
            }
        }, 100);
        
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
    }

    // Atualizar ícones dos botões com as habilidades do campeão
    updateAbilityIcons() {
        if (!this.championAbilities || !this.container) return;

        const actionsContainer = this.container.querySelector('#petActionsContainer');
        if (!actionsContainer) return;

        // Mapear ações para habilidades
        const abilityMapping = {
            'passive': this.championAbilities.passive, // Passiva
            'q': this.championAbilities.q,            // Q
            'w': this.championAbilities.w,            // W
            'e': this.championAbilities.e,            // E
            'r': this.championAbilities.r             // R
        };

        // Atualizar cada botão com o ícone da habilidade
        actionsContainer.innerHTML = '';
        
        for (const [action, ability] of Object.entries(abilityMapping)) {
            if (ability && ability.icon) {
                const button = document.createElement('button');
                button.className = 'pet-action-btn-minimal ability-icon-btn';
                button.dataset.action = action;
                button.title = ability.name || action;
                
                const img = document.createElement('img');
                img.src = ability.icon;
                img.alt = ability.name || action;
                img.className = 'ability-icon-img';
                
                const key = document.createElement('span');
                key.className = 'ability-key';
                key.textContent = ability.key;
                
                button.appendChild(img);
                button.appendChild(key);
                actionsContainer.appendChild(button);
                
                // Re-adicionar event listener
                button.addEventListener('click', () => {
                    this.interact(action);
                });
            }
        }
    }

    async init3DModel(modelPath) {
        const petCharacter = this.container.querySelector('#petCharacter');
        if (!petCharacter) return;
        
        // Verificar se já foi inicializado ou está carregando
        if (this.renderer3D && this.is3DModel) return;
        if (this.isLoading3DModel) return;
        
        this.isLoading3DModel = true;
        
        // Limpar conteúdo anterior
        petCharacter.innerHTML = '<div style="color: #fff; text-align: center; padding: 20px;">Carregando...</div>';
        
        try {
            // Criar renderer 3D se não existir
            if (!this.renderer3D) {
                const { Pet3DRenderer } = await import('./pet-3d-renderer.js');
                this.renderer3D = new Pet3DRenderer(petCharacter, () => this.onMascotClick());
                await this.renderer3D.init();
            }
            
            // Carregar modelo
            const success = await this.renderer3D.loadModel(modelPath);
            
            if (success) {
                this.is3DModel = true;
                this.isLoading3DModel = false;
                petCharacter.classList.add('model-3d');
                
                // Aplicar animação padrão se configurada
                const defaultAnim = this.data.animationSettings?.default ?? -1;
                if (defaultAnim >= 0) {
                    setTimeout(() => {
                        this.renderer3D.playAnimation(defaultAnim, 'repeat');
                    }, 100);
                }
                // Se defaultAnim é -1, fica na T-pose (sem animação)
                
                // Atualizar lista de animações
                this.updateAnimationsList();
                
                // Popular configurações de animação com valores salvos
                const animations = this.renderer3D.getAnimations();
                if (animations && animations.length > 0) {
                    this.populateAnimationSettings(animations);
                }
            } else {
                petCharacter.innerHTML = '<div style="color: #ff6b6b; text-align: center; padding: 20px;">Erro ao carregar</div>';
                this.isLoading3DModel = false;
            }
        } catch (error) {
            petCharacter.innerHTML = '<div style="color: #ff6b6b; text-align: center; padding: 20px;">Erro: ' + error.message + '</div>';
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
            { id: 'animOnPassive', key: 'onPassive' },
            { id: 'animOnQ', key: 'onQ' },
            { id: 'animOnW', key: 'onW' },
            { id: 'animOnE', key: 'onE' },
            { id: 'animOnR', key: 'onR' }
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
            
            // Remover listeners antigos (se houver)
            if (select._changeHandler) {
                select.removeEventListener('change', select._changeHandler);
            }
            
            // Criar e guardar referência ao handler
            select._changeHandler = () => {
                if (!this.data.animationSettings) {
                    this.data.animationSettings = {};
                }
                const animIndex = parseInt(select.value);
                this.data.animationSettings[key] = animIndex;
                this.saveData();
                
                // Se for animação padrão, aplicar imediatamente
                if (key === 'default' && animIndex >= 0) {
                    if (this.renderer3D) {
                        this.renderer3D.playAnimation(animIndex, 'repeat');
                    }
                    if (this.mainRenderer) {
                        this.mainRenderer.playAnimation(animIndex, 'repeat');
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
            };
            
            // Adicionar listener
            select.addEventListener('change', select._changeHandler);
        });
    }

    // Preencher configurações com valores salvos (sem precisar do renderer)
    populateAnimationSettingsWithSavedValues() {
        const settings = this.data.animationSettings || {};
        
        const selects = [
            { id: 'animDefault', key: 'default', label: 'Animação Padrão' },
            { id: 'animOnTaskComplete', key: 'onTaskComplete', label: 'Ao Completar Tarefa' },
            { id: 'animOnLevelUp', key: 'onLevelUp', label: 'Ao Subir de Nível' },
            { id: 'animOnPassive', key: 'onPassive', label: 'Passiva (P)' },
            { id: 'animOnQ', key: 'onQ', label: 'Habilidade Q' },
            { id: 'animOnW', key: 'onW', label: 'Habilidade W' },
            { id: 'animOnE', key: 'onE', label: 'Habilidade E' },
            { id: 'animOnR', key: 'onR', label: 'Habilidade R' }
        ];
        
        selects.forEach(({ id, key, label }) => {
            const select = document.querySelector(`#${id}`);
            if (!select) return;
            
            const savedValue = settings[key] !== undefined ? settings[key] : -1;
            
            // Mostrar carregando em todos os selects enquanto não há animações
            select.innerHTML = '<option value="-1">Carregando...</option>';
            
            // Definir valor
            select.value = -1;
            
            // Remover listeners antigos (se houver)
            if (select._changeHandler) {
                select.removeEventListener('change', select._changeHandler);
            }
            
            // Criar e guardar referência ao handler
            select._changeHandler = () => {
                if (!this.data.animationSettings) {
                    this.data.animationSettings = {};
                }
                const animIndex = parseInt(select.value);
                this.data.animationSettings[key] = animIndex;
                this.saveData();
                
                // Mostrar feedback
                const modal = document.getElementById('petSettingsModal');
                if (modal && modal.style.display !== 'none') {
                    const note = modal.querySelector('.settings-note p');
                    if (note) {
                        const originalText = note.innerHTML;
                        note.innerHTML = '✅ <strong>Configuração salva! Abra a aba Mascote para aplicar.</strong>';
                        note.style.color = '#10b981';
                        setTimeout(() => {
                            note.innerHTML = originalText;
                            note.style.color = '';
                        }, 3000);
                    }
                }
            };
            
            // Adicionar listener
            select.addEventListener('change', select._changeHandler);
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
    
    // Mostrar mensagem de carregamento
    mainPetCharacter.innerHTML = '<div style="color: #fff; text-align: center; padding: 20px; font-size: 12px;">Carregando...</div>';
    
    // Importar Pet3DRenderer dinamicamente
    import('./pet-3d-renderer.js').then(module => {
        const { Pet3DRenderer } = module;
        const miniRenderer = new Pet3DRenderer(mainPetCharacter, () => {
            if (petSystem) petSystem.onMascotClick();
        });
        
        // Definir animação padrão antes de carregar
        miniRenderer.defaultAnimIndex = petSystem.data.animationSettings?.default ?? -1;
        
        miniRenderer.init().then(() => {
            miniRenderer.loadModel('src/assets/ornn.glb').then(() => {
                // Aplicar animação padrão após carregar (se configurada)
                const defaultAnim = petSystem.data.animationSettings?.default ?? -1;
                if (defaultAnim >= 0) {
                    setTimeout(() => {
                        miniRenderer.playAnimation(defaultAnim, 'repeat');
                    }, 100);
                }
                // Se defaultAnim é -1, fica na T-pose (sem animação)
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
    
    // Popular settings com animações ou valores salvos
    if (petSystem) {
        // Verificar se há animações carregadas
        const animations = petSystem.renderer3D?.getAnimations() || [];
        const hasAnimations = animations.length > 0;
        
        if (hasAnimations) {
            // Modelo carregado com animações - popular tudo
            petSystem.populateAnimationSettings(animations);
            populateAnimOnClickSetting(animations);
        } else {
            // Modelo não carregado - mostrar valores salvos
            petSystem.populateAnimationSettingsWithSavedValues();
            populateAnimOnClickSetting([]);
        }
    }
}

function populateAnimOnClickSetting(animations = []) {
    if (!petSystem) return;
    
    const select = document.getElementById('animOnClick');
    if (!select) return;
    
    const savedValue = petSystem.data.animOnClick ?? -1;
    
    // Se não há animações carregadas, mostrar Carregando em todos
    if (animations.length === 0) {
        select.innerHTML = '<option value="-1">Carregando...</option>';
        select.value = -1;
        return;
    }
    
    // Limpar opções e adicionar animações disponíveis
    select.innerHTML = '<option value="-1">Nenhuma</option>';
    
    // Adicionar opções de animações disponíveis
    animations.forEach((anim, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = anim.name || `Animação ${index + 1}`;
        select.appendChild(option);
    });
    
    // Selecionar valor salvo
    select.value = savedValue;
    
    // Remover listener antigo se existir
    if (select._changeHandler) {
        select.removeEventListener('change', select._changeHandler);
    }
    
    // Criar e guardar novo handler
    select._changeHandler = () => {
        petSystem.data.animOnClick = parseInt(select.value);
        petSystem.saveData();
    };
    
    // Adicionar listener
    select.addEventListener('change', select._changeHandler);
}

export function closePetSettingsModal() {
    const modal = document.getElementById('petSettingsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}
