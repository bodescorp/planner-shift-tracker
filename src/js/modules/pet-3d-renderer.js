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
        console.error('❌ Erro ao carregar Three.js:', error);
        return false;
    }
}

export class Pet3DRenderer {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
        this.animationId = null;
        this.mixer = null;
        this.clock = null;
    }

    async init() {
        const loaded = await loadThreeJS();
        if (!loaded) {
            console.error('❌ Three.js não carregado');
            return false;
        }

        // Criar cena
        this.scene = new THREE.Scene();
        this.scene.background = null; // Transparente
        
        // Câmera (ajustada para zoom de 50%)
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.set(0, 0.3, 3); // Centralizado e mais baixo
        
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
        
        // Controles de órbita
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.autoRotate = false; // Desativado
        this.controls.autoRotateSpeed = 0;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 8;
        this.controls.target.set(0, 0, 0); // Centralizar no modelo
        
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
            console.error('❌ GLTFLoader não disponível');
            return false;
        }

        try {
            // Remover modelo anterior
            if (this.model) {
                this.scene.remove(this.model);
                this.model = null;
            }

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
                        
                        const maxDim = Math.max(size.x, size.y, size.z);
                        const scale = 1 / maxDim; // 50% do tamanho original
                        this.model.scale.multiplyScalar(scale);
                        
                        this.model.position.sub(center.multiplyScalar(scale));
                        this.model.position.y -= 0.2; // Abaixar um pouco o modelo
                        
                        // Adicionar à cena
                        this.scene.add(this.model);
                        
                        // Configurar animações se houver
                        if (gltf.animations && gltf.animations.length > 0) {
                            this.mixer = new THREE.AnimationMixer(this.model);
                            this.animations = gltf.animations;
                            this.currentActions = [];
                            
                            // Guardar referência às ações
                            this.animations.forEach((clip) => {
                                const action = this.mixer.clipAction(clip);
                                this.currentActions.push(action);
                            });
                            
                            // Reproduzir animação padrão se configurada
                            if (this.defaultAnimIndex !== undefined && this.defaultAnimIndex >= 0 && this.currentActions[this.defaultAnimIndex]) {
                                this.currentActions[this.defaultAnimIndex].play();
                            } else if (this.currentActions.length > 0) {
                                // Caso contrário, reproduzir primeira animação
                                this.currentActions[0].play();
                            }
                        }
                        
                        // Iniciar loop de animação
                        this.animate();
                        
                        console.log('✅ Modelo 3D carregado:', modelPath);
                        resolve(true);
                    },
                    (progress) => {
                        const percent = (progress.loaded / progress.total) * 100;
                        console.log(`📦 Carregando modelo: ${percent.toFixed(0)}%`);
                    },
                    (error) => {
                        console.error('❌ Erro ao carregar modelo:', error);
                        reject(error);
                    }
                );
            });
        } catch (error) {
            console.error('❌ Erro ao processar modelo:', error);
            return false;
        }
    }

    animate() {
        if (!this.renderer || !this.scene || !this.camera) return;
        
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

    dispose() {
        // Parar animação
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
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
            this.playAnimation(index);
        }
    }

    playAnimation(index) {
        if (!this.currentActions || index >= this.currentActions.length) return;
        
        // Parar todas as animações
        this.currentActions.forEach(action => action.stop());
        
        // Reproduzir animação selecionada
        this.currentActions[index].reset().play();
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
