/* =====================================================
   MUNDO MÁGICO - Animações JavaScript
   Efeitos visuais avançados e interativos
   ===================================================== */

'use strict';

/* =====================================================
   1. PARALLAX SUAVE NO HERO
   ===================================================== */

function initParallax() {
    const hero = document.querySelector('.hero');
    const clouds = document.querySelectorAll('.cloud');
    const rainbow = document.querySelector('.hero__rainbow');
    const mascot = document.querySelector('.mascot-unicorn');
    const floatingItems = document.querySelectorAll('.float-item');
    
    if (!hero) return;
    
    // Verifica preferência de movimento reduzido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    let ticking = false;
    
    function updateParallax() {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;
        
        // Só aplica parallax enquanto hero está visível
        if (scrollY > heroHeight) {
            ticking = false;
            return;
        }
        
        // Nuvens - movimento mais lento
        clouds.forEach((cloud, i) => {
            const speed = 0.3 + (i * 0.1);
            cloud.style.transform = `translateY(${scrollY * speed}px)`;
        });
        
        // Arco-íris
        if (rainbow) {
            rainbow.style.transform = `translateY(${scrollY * 0.2}px) rotate(${scrollY * 0.02}deg)`;
        }
        
        // Mascote
        if (mascot) {
            mascot.style.transform = `translateY(${scrollY * 0.15}px)`;
        }
        
        // Itens flutuantes
        floatingItems.forEach((item, i) => {
            const direction = i % 2 === 0 ? 1 : -1;
            item.style.transform = `translateY(${scrollY * 0.1 * direction}px) rotate(${scrollY * 0.1 * direction}deg)`;
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
}

/* =====================================================
   2. ANIMAÇÃO DE TEXTO DIGITANDO
   ===================================================== */

function initTypingEffect() {
    const typingElements = document.querySelectorAll('[data-typing]');
    
    typingElements.forEach(element => {
        const text = element.getAttribute('data-typing') || element.textContent;
        const speed = parseInt(element.getAttribute('data-typing-speed')) || 100;
        
        element.textContent = '';
        element.style.visibility = 'visible';
        
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        // Inicia quando visível
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    type();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(element);
    });
}

/* =====================================================
   3. EFEITO RIPPLE EM BOTÕES
   ===================================================== */

function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;
            
            // Adiciona keyframe se não existir
            if (!document.querySelector('#ripple-keyframe')) {
                const style = document.createElement('style');
                style.id = 'ripple-keyframe';
                style.textContent = `
                    @keyframes ripple {
                        to {
                            transform: scale(4);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

/* =====================================================
   4. ANIMAÇÃO DE HOVER NOS CARDS
   ===================================================== */

function initCardAnimations() {
    const cards = document.querySelectorAll('.service-card, .about__card, .info-card');
    
    cards.forEach(card => {
        // Efeito de brilho no hover
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.setProperty('--mouse-x', `${x}px`);
            this.style.setProperty('--mouse-y', `${y}px`);
        });
    });
    
    // Adiciona efeito de brilho via CSS
    const style = document.createElement('style');
    style.textContent = `
        .service-card::after,
        .about__card::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(
                circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
                rgba(124, 58, 237, 0.1) 0%,
                transparent 50%
            );
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .service-card:hover::after,
        .about__card:hover::after {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}

/* =====================================================
   5. ANIMAÇÃO DE ENTRADA STAGGERED
   ===================================================== */

function initStaggeredAnimations() {
    const staggerGroups = document.querySelectorAll('[data-stagger]');
    
    staggerGroups.forEach(group => {
        const children = group.children;
        const delay = parseInt(group.getAttribute('data-stagger-delay')) || 100;
        
        Array.from(children).forEach((child, i) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(30px)';
            child.style.transition = `all 0.5s ease ${i * delay}ms`;
        });
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    Array.from(children).forEach(child => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(group);
    });
}

/* =====================================================
   6. MOUSE TRAIL SPARKLES
   ===================================================== */

function initMouseSparkles() {
    // Verifica se não é touch device
    if (!window.matchMedia('(hover: hover)').matches) return;
    
    // Verifica preferência de movimento
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const sparkles = [];
    const maxSparkles = 20;
    let lastTime = 0;
    const minInterval = 50; // ms entre sparkles
    
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastTime < minInterval) return;
        lastTime = now;
        
        // Só cria sparkles em algumas áreas (não em toda a página)
        const target = e.target;
        if (!target.closest('.hero, .services, .gallery')) return;
        
        createSparkle(e.clientX, e.clientY);
    });
    
    function createSparkle(x, y) {
        const sparkle = document.createElement('span');
        sparkle.textContent = ['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)];
        sparkle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 9999;
            font-size: ${12 + Math.random() * 12}px;
            animation: sparkle-trail 1s ease-out forwards;
            transform: translate(-50%, -50%);
        `;
        
        document.body.appendChild(sparkle);
        sparkles.push(sparkle);
        
        // Limita número de sparkles
        if (sparkles.length > maxSparkles) {
            const old = sparkles.shift();
            old.remove();
        }
        
        // Remove após animação
        setTimeout(() => {
            sparkle.remove();
            const index = sparkles.indexOf(sparkle);
            if (index > -1) sparkles.splice(index, 1);
        }, 1000);
    }
    
    // Adiciona keyframe
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkle-trail {
            0% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1) rotate(0deg);
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -100%) scale(0.5) rotate(180deg);
            }
        }
    `;
    document.head.appendChild(style);
}

/* =====================================================
   7. SCROLL PROGRESS INDICATOR
   ===================================================== */

function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.setAttribute('aria-hidden', 'true');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 4px;
        background: linear-gradient(90deg, #7c3aed, #f472b6, #fbbf24);
        z-index: 10000;
        width: 0%;
        transition: width 0.1s ease-out;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    }, { passive: true });
}

/* =====================================================
   8. HOVER SOUND EFFECTS (Opcional)
   ===================================================== */

function initHoverSounds() {
    // Desativado por padrão - descomente para ativar
    return;
    
    /*
    const buttons = document.querySelectorAll('.btn, .nav__link');
    
    // Cria contexto de áudio
    let audioContext;
    
    function playHoverSound() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.1;
        
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
    
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', playHoverSound);
    });
    */
}

/* =====================================================
   9. SMOOTH REVEAL ON SCROLL
   ===================================================== */

function initSmoothReveal() {
    const sections = document.querySelectorAll('.section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '-50px'
    });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(section);
    });
    
    // Adiciona estilos para revealed
    const style = document.createElement('style');
    style.textContent = `
        .section.revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/* =====================================================
   10. EMOJI EXPLOSION NO CLIQUE
   ===================================================== */

function initEmojiExplosion() {
    const hero = document.querySelector('.hero');
    
    if (!hero) return;
    
    hero.addEventListener('click', (e) => {
        // Evita explosão em links e botões
        if (e.target.closest('a, button')) return;
        
        const emojis = ['🎈', '🎉', '⭐', '✨', '💖', '🌈', '🦄', '🎀', '🍭', '🎪'];
        const count = 8;
        
        for (let i = 0; i < count; i++) {
            const emoji = document.createElement('span');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.cssText = `
                position: fixed;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                font-size: 24px;
                pointer-events: none;
                z-index: 9999;
                animation: emoji-explode 1s ease-out forwards;
                --angle: ${(360 / count) * i}deg;
                --distance: ${50 + Math.random() * 50}px;
            `;
            
            document.body.appendChild(emoji);
            
            setTimeout(() => emoji.remove(), 1000);
        }
    });
    
    // Adiciona keyframe
    const style = document.createElement('style');
    style.textContent = `
        @keyframes emoji-explode {
            0% {
                opacity: 1;
                transform: translate(-50%, -50%) rotate(0deg) scale(1);
            }
            100% {
                opacity: 0;
                transform: 
                    translate(
                        calc(-50% + cos(var(--angle)) * var(--distance)),
                        calc(-50% + sin(var(--angle)) * var(--distance) - 100px)
                    )
                    rotate(360deg)
                    scale(0.5);
            }
        }
    `;
    document.head.appendChild(style);
}

/* =====================================================
   11. ANIMAÇÃO DO MASCOTE
   ===================================================== */

function initMascotAnimation() {
    const mascot = document.querySelector('.mascot-unicorn');
    
    if (!mascot) return;
    
    // Reage ao movimento do mouse
    document.addEventListener('mousemove', (e) => {
        const rect = mascot.getBoundingClientRect();
        const mascotCenterX = rect.left + rect.width / 2;
        const mascotCenterY = rect.top + rect.height / 2;
        
        const angleX = (e.clientY - mascotCenterY) / 50;
        const angleY = (mascotCenterX - e.clientX) / 50;
        
        mascot.style.transform = `
            rotateX(${Math.max(-10, Math.min(10, angleX))}deg)
            rotateY(${Math.max(-10, Math.min(10, angleY))}deg)
        `;
    });
    
    // Clique no mascote
    mascot.addEventListener('click', () => {
        mascot.style.animation = 'none';
        mascot.offsetHeight; // Trigger reflow
        mascot.style.animation = 'tada 1s ease';
        
        // Cria corações
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const heart = document.createElement('span');
                heart.textContent = '💖';
                heart.style.cssText = `
                    position: absolute;
                    font-size: 2rem;
                    animation: float-up 1s ease-out forwards;
                    left: ${50 + Math.random() * 30 - 15}%;
                    top: ${50 + Math.random() * 30 - 15}%;
                    pointer-events: none;
                `;
                mascot.parentElement.appendChild(heart);
                setTimeout(() => heart.remove(), 1000);
            }, i * 100);
        }
    });
    
    // Adiciona keyframe
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-up {
            0% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-100px) scale(1.5);
            }
        }
    `;
    document.head.appendChild(style);
}

/* =====================================================
   12. ANIMAÇÃO DE DIGITAÇÃO NO PLACEHOLDER
   ===================================================== */

function initPlaceholderAnimation() {
    const inputs = document.querySelectorAll('.form-input[placeholder]');
    
    inputs.forEach(input => {
        const originalPlaceholder = input.placeholder;
        let interval;
        
        input.addEventListener('focus', () => {
            clearInterval(interval);
            input.placeholder = '';
        });
        
        input.addEventListener('blur', () => {
            if (input.value) return;
            
            let i = 0;
            interval = setInterval(() => {
                input.placeholder = originalPlaceholder.substring(0, i + 1);
                i++;
                if (i >= originalPlaceholder.length) {
                    clearInterval(interval);
                }
            }, 50);
        });
    });
}

/* =====================================================
   13. INICIALIZAÇÃO DAS ANIMAÇÕES
   ===================================================== */

function initAnimations() {
    // Aguarda DOM estar pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAllAnimations);
    } else {
        initAllAnimations();
    }
}

function initAllAnimations() {
    // Verifica preferência de movimento reduzido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        console.log('🎨 Animações reduzidas conforme preferência do usuário');
        return;
    }
    
    initParallax();
    initTypingEffect();
    initRippleEffect();
    initCardAnimations();
    initStaggeredAnimations();
    initMouseSparkles();
    initScrollProgress();
    initHoverSounds();
    initSmoothReveal();
    initEmojiExplosion();
    initMascotAnimation();
    initPlaceholderAnimation();
    
    console.log('✨ Animações mágicas carregadas!');
}

// Inicia
initAnimations();
