// ========================================
// RENDERIZADOR 3D PARA MASCOTE
// ========================================

let THREE = null;
let GLTFLoader = null;
let OrbitControls = null;

// Carregar Three.js dinamicamente
async function loadThreeJS() {
    if (THREE) return true;
    
    try {
        THREE = await import('three');
        const { GLTFLoader: Loader } = await import('three/addons/loaders/GLTFLoader.js');
        const { OrbitControls: Controls } = await import('three/addons/controls/OrbitControls.js');
        GLTFLoader = Loader;
        OrbitControls = Controls;
        return true;
    } catch (error) {
        return false;
    }
}

export class Pet3DRenderer {
    constructor(container, onClickCallback = null) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
        this.animationId = null;
        this.mixer = null;
        this.clock = null;
        this.fadeDuration = 0.5; // Duração do fade (aumentado para transição mais suave)
        this.animationSpeed = 1.0; // Velocidade padrão
        this.onClickCallback = onClickCallback;
        this.raycaster = null;
        this.mouse = null;
    }

    async init() {
        const loaded = await loadThreeJS();
        if (!loaded) {
            return false;
        }
        
        // Criar raycaster para detecção de cliques
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Criar cena
        this.scene = new THREE.Scene();
        this.scene.background = null; // Transparente
        
        // Câmera (ajustada para melhor visualização)
        const width = this.container.clientWidth || 250;
        const height = this.container.clientHeight || 250;
        
        this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        this.camera.position.set(0, 1.5, 4); // Posição centralizada e afastada
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        
        // Limpar container e adicionar canvas
        this.container.innerHTML = '';
        this.container.appendChild(this.renderer.domElement);
        
        // Adicionar evento de clique no canvas (apenas uma vez)
        if (!this.clickHandlerAdded) {
            this.clickHandler = (event) => this.onCanvasClick(event);
            this.renderer.domElement.addEventListener('click', this.clickHandler);
            this.clickHandlerAdded = true;
        }
        
        // Controles de órbita
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.autoRotate = false;
        this.controls.autoRotateSpeed = 0;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 10;
        this.controls.target.set(0, 1, 0); // Centralizar na origem
        
        // Iluminação
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
        
        const directionalLight2 = new THREE.DirectionalLight(0xa78bfa, 1);
        directionalLight2.position.set(-5, 3, -5);
        this.scene.add(directionalLight2);
        
        // Clock para animações
        this.clock = new THREE.Clock();
        
        // Resize handler
        window.addEventListener('resize', () => this.onWindowResize(), false);
        
        return true;
    }

    async loadModel(modelPath) {
        if (!GLTFLoader) {
            return false;
        }

        try {
            // Verificar se o modelo já está carregado
            if (this.model && this.currentModelPath === modelPath) {
                return true; // Modelo já carregado
            }
            
            // Remover modelo anterior
            if (this.model) {
                this.scene.remove(this.model);
                this.model = null;
            }
            
            this.currentModelPath = modelPath;

            const loader = new GLTFLoader();
            
            return new Promise((resolve, reject) => {
                loader.load(
                    modelPath,
                    (gltf) => {
                        this.model = gltf.scene;
                        
                        // Centralizar e ajustar escala
                        const box = new THREE.Box3().setFromObject(this.model);
                        const center = box.getCenter(new THREE.Vector3());
                        const size = box.getSize(new THREE.Vector3());
                        
                        // Ajustar escala para preencher melhor a tela
                        const maxDim = Math.max(size.x, size.y, size.z);
                        const scale = 2.0 / maxDim; // Escala ajustada
                        this.model.scale.multiplyScalar(scale);
                        
                        // Centralizar o modelo na origem
                        this.model.position.set(
                            -center.x * scale,
                            -center.y * scale + 1, // Elevar um pouco
                            -center.z * scale
                        );
                        
                        // Adicionar à cena
                        this.scene.add(this.model);
                        
                        // Configurar animações se houver
                        if (gltf.animations && gltf.animations.length > 0) {
                            this.mixer = new THREE.AnimationMixer(this.model);
                            this.animations = gltf.animations;
                            this.currentActions = [];
                            
                            // Guardar referência às ações (mas NÃO reproduzir nada automaticamente)
                            this.animations.forEach((clip) => {
                                const action = this.mixer.clipAction(clip);
                                this.currentActions.push(action);
                            });
                            
                            // NÃO reproduzir animação automaticamente aqui
                            // A animação padrão será definida externamente via playAnimation()
                        }
                        
                        // Iniciar loop de animação
                        this.animate();
                        
                        resolve(true);
                    },
                    (progress) => {
                        // Progresso do carregamento
                    },
                    (error) => {
                        reject(error);
                    }
                );
            });
        } catch (error) {
            return false;
        }
    }

    animate() {
        if (!this.renderer || !this.scene || !this.camera) {
            return;
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        
        // Atualizar mixer de animações
        if (this.mixer) {
            this.mixer.update(delta);
        }
        
        // Atualizar controles
        if (this.controls) {
            this.controls.update();
        }
        
        // Renderizar
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        if (!this.camera || !this.renderer || !this.container) return;
        
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    stopAutoRotate() {
        if (this.controls) {
            this.controls.autoRotate = false;
        }
    }

    startAutoRotate() {
        if (this.controls) {
            this.controls.autoRotate = true;
        }
    }

    onCanvasClick(event) {
        if (!this.model || !this.camera || !this.raycaster) return;
        
        // Calcular posição do mouse em coordenadas normalizadas
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Atualizar raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Verificar interseções com o modelo
        const intersects = this.raycaster.intersectObject(this.model, true);
        
        if (intersects.length > 0 && this.onClickCallback) {
            this.onClickCallback();
        }
    }

    dispose() {
        // Parar animação
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // Remover event listener de clique
        if (this.clickHandler && this.renderer && this.renderer.domElement) {
            this.renderer.domElement.removeEventListener('click', this.clickHandler);
            this.clickHandlerAdded = false;
        }
        
        // Limpar recursos
        if (this.model) {
            this.scene.remove(this.model);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.controls) {
            this.controls.dispose();
        }
        
        // Limpar container
        if (this.container) {
            this.container.innerHTML = '';
        }
    }

    setEmotionEffect(emotion) {
        if (!this.model) return;
        
        switch(emotion) {
            case 'happy':
                // Bounce effect
                if (!this.bounceAnimation) {
                    this.bounceAnimation = setInterval(() => {
                        if (this.model) {
                            this.model.position.y = Math.sin(Date.now() * 0.005) * 0.1;
                        }
                    }, 16);
                }
                break;
            case 'excited':
                // Shake effect
                this.stopAutoRotate();
                if (this.model) {
                    this.model.rotation.y += 0.5;
                }
                setTimeout(() => this.startAutoRotate(), 2000);
                break;
            default:
                // Clear effects
                if (this.bounceAnimation) {
                    clearInterval(this.bounceAnimation);
                    this.bounceAnimation = null;
                    if (this.model) {
                        this.model.position.y = 0;
                    }
                }
        }
    }

    getAnimations() {
        return this.animations || [];
    }

    setDefaultAnimation(index) {
        this.defaultAnimIndex = index;
        if (index >= 0 && this.currentActions && this.currentActions[index]) {
            // Parar todas as animações
            this.currentActions.forEach(action => action.stop());
            
            // Reproduzir animação padrão em loop
            const action = this.currentActions[index];
            action.reset();
            action.setLoop(THREE.LoopRepeat);
            action.timeScale = this.animationSpeed; // Aplicar velocidade
            action.play();
        }
    }

    playAnimation(index, loopMode = 'once') {
        if (!this.currentActions || index >= this.currentActions.length || index < 0) return;
        
        const newAction = this.currentActions[index];
        
        // Parar todas as outras animações (exceto a nova)
        this.currentActions.forEach((action, i) => {
            if (i !== index && action.isRunning()) {
                action.fadeOut(this.fadeDuration);
            }
        });
        
        // Configurar e reproduzir a nova animação imediatamente
        newAction.stop();
        newAction.time = 0;
        newAction.timeScale = this.animationSpeed;
        
        // Configurar loop baseado no parâmetro
        if (loopMode === 'repeat') {
            newAction.setLoop(THREE.LoopRepeat);
            newAction.clampWhenFinished = false;
        } else {
            newAction.setLoop(THREE.LoopOnce);
            newAction.clampWhenFinished = true;
        }
        
        // Iniciar com fadeIn para transição suave
        newAction.reset();
        newAction.fadeIn(this.fadeDuration);
        newAction.play();
    }

    setFadeDuration(duration) {
        this.fadeDuration = duration;
    }

    setAnimationSpeed(speed) {
        this.animationSpeed = speed;
        
        // Aplicar velocidade às animações em execução
        if (this.currentActions) {
            this.currentActions.forEach(action => {
                action.timeScale = speed;
            });
        }
    }

    stopAllAnimations() {
        if (!this.currentActions) return;
        this.currentActions.forEach(action => action.stop());
    }

    pauseAllAnimations() {
        if (!this.currentActions) return;
        this.currentActions.forEach(action => action.paused = true);
    }

    resumeAllAnimations() {
        if (!this.currentActions) return;
        this.currentActions.forEach(action => action.paused = false);
    }

    toggleAnimations() {
        if (!this.currentActions || this.currentActions.length === 0) return false;
        
        const isPaused = this.currentActions[0].paused;
        if (isPaused) {
            this.resumeAllAnimations();
            return true; // Playing
        } else {
            this.pauseAllAnimations();
            return false; // Paused
        }
    }
}
