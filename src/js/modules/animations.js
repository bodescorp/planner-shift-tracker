/**
 * Módulo de Animações de Entrada/Saída
 * Gerencia animações suaves para elementos
 */

export class AnimationManager {
    constructor() {
        this.observeElements();
    }

    /**
     * Observer para detectar elementos entrando na viewport
     */
    observeElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observar cards e elementos principais
        const elementsToAnimate = document.querySelectorAll(
            '.day-card, .modal-content, .page-header, .info-item'
        );
        
        elementsToAnimate.forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    }

    /**
     * Anima entrada de um elemento
     */
    static fadeIn(element, duration = 300) {
        return new Promise(resolve => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = `all ${duration}ms ease`;
            
            requestAnimationFrame(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                
                setTimeout(resolve, duration);
            });
        });
    }

    /**
     * Anima saída de um elemento
     */
    static fadeOut(element, duration = 300) {
        return new Promise(resolve => {
            element.style.transition = `all ${duration}ms ease`;
            element.style.opacity = '0';
            element.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                element.style.display = 'none';
                resolve();
            }, duration);
        });
    }

    /**
     * Anima checkbox check
     */
    static animateCheckbox(checkbox) {
        const wrapper = checkbox.closest('.activity');
        if (!wrapper) return;

        if (checkbox.checked) {
            wrapper.classList.add('checking');
            
            if (navigator.vibrate) {
                navigator.vibrate(30);
            }

            setTimeout(() => {
                wrapper.classList.remove('checking');
                wrapper.classList.add('checked-animation');
            }, 150);

            setTimeout(() => {
                wrapper.classList.remove('checked-animation');
            }, 600);
        } else {
            wrapper.classList.add('unchecking');
            
            setTimeout(() => {
                wrapper.classList.remove('unchecking');
            }, 300);
        }
    }

    /**
     * Animação de counter/número
     */
    static animateCounter(element, start, end, duration = 1000) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.round(current);
        }, 16);
    }

    /**
     * Stagger animation para lista de elementos
     */
    static staggerFadeIn(elements, delay = 50) {
        elements.forEach((el, index) => {
            setTimeout(() => {
                this.fadeIn(el, 300);
            }, index * delay);
        });
    }
}

// CSS para Animações
const animationStyles = `
/* Animações de entrada/saída */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeOutDown {
    from {
        opacity: 1;
        transform: translateY(0);
    }
    to {
        opacity: 0;
        transform: translateY(30px);
    }
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-on-scroll.animate-in {
    opacity: 1;
    transform: translateY(0);
}

/* Animação de checkbox */
.activity {
    transition: all 0.3s ease;
}

.activity.checking {
    transform: scale(0.98);
}

.activity.checked-animation {
    animation: checkPulse 0.6s ease;
}

.activity.unchecking {
    animation: uncheckShake 0.3s ease;
}

@keyframes checkPulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.02);
    }
}

@keyframes uncheckShake {
    0%, 100% {
        transform: translateX(0);
    }
    25% {
        transform: translateX(-5px);
    }
    75% {
        transform: translateX(5px);
    }
}

/* Hover effects melhorados */
.day-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.day-card:hover {
    transform: translateY(-2px);
}

.activity:hover {
    transform: translateX(4px);
}

/* Modal animations */
.modal {
    animation: fadeIn 0.3s ease;
}

.modal-content {
    animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

/* Stagger animation para listas */
.day-card:nth-child(1) { animation-delay: 0ms; }
.day-card:nth-child(2) { animation-delay: 50ms; }
.day-card:nth-child(3) { animation-delay: 100ms; }
.day-card:nth-child(4) { animation-delay: 150ms; }
.day-card:nth-child(5) { animation-delay: 200ms; }
.day-card:nth-child(6) { animation-delay: 250ms; }
.day-card:nth-child(7) { animation-delay: 300ms; }

.week-content.active .day-card {
    animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
}

/* Page transitions */
.page-transition-enter {
    animation: fadeInUp 0.4s ease;
}

.page-transition-exit {
    animation: fadeOutDown 0.3s ease;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    .animate-on-scroll,
    .day-card,
    .activity,
    .modal,
    .modal-content {
        animation: none !important;
        transition: none !important;
    }
    
    .animate-on-scroll {
        opacity: 1;
        transform: none;
    }
    
    .activity:hover,
    .day-card:hover {
        transform: none;
    }
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

export default AnimationManager;
