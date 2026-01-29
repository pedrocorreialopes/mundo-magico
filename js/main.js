/* =====================================================
   MUNDO MÁGICO - JavaScript Principal
   Interatividade encantadora e experiência mágica
   ===================================================== */

'use strict';

/* =====================================================
   1. CONFIGURAÇÕES E ESTADO GLOBAL
   ===================================================== */

const CONFIG = {
    scrollThreshold: 100,
    animationThreshold: 0.15,
    debounceDelay: 100,
    throttleDelay: 16,
    counterDuration: 2000,
    particleCount: 30,
    particleEmojis: ['✨', '⭐', '🌟', '💫', '🎈', '🎀', '💖', '🦋', '🌸', '🍭']
};

const state = {
    isLoading: true,
    currentTheme: 'light',
    mobileMenuOpen: false,
    scrollPosition: 0,
    countersAnimated: false
};

/* =====================================================
   2. UTILITÁRIOS
   ===================================================== */

// Debounce - Limita a frequência de execução
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle - Garante execução em intervalos regulares
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Seleciona elementos do DOM
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

// Verifica se elemento está visível na viewport
function isInViewport(element, threshold = 0) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.top <= windowHeight * (1 - threshold) && rect.bottom >= 0;
}

// Gera número aleatório
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Seleciona item aleatório de array
function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/* =====================================================
   3. LOADING SCREEN
   ===================================================== */

function initLoadingScreen() {
    const loadingScreen = $('#loading-screen');
    
    if (!loadingScreen) return;
    
    // Aguarda o carregamento da página
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            state.isLoading = false;
            document.body.style.overflow = '';
            
            // Inicia animações após loading
            initScrollAnimations();
            createFloatingParticles();
        }, 1000);
    });
    
    // Fallback - esconde loading após 5 segundos
    setTimeout(() => {
        if (state.isLoading) {
            loadingScreen.classList.add('hidden');
            state.isLoading = false;
        }
    }, 5000);
}

/* =====================================================
   4. NAVEGAÇÃO E HEADER
   ===================================================== */

function initNavigation() {
    const header = $('.header');
    const navToggle = $('#nav-toggle');
    const navMenu = $('#nav-menu');
    const navLinks = $$('.nav__link');
    
    // Toggle menu mobile
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isOpen);
            state.mobileMenuOpen = isOpen;
            
            // Previne scroll quando menu está aberto
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
    }
    
    // Fecha menu ao clicar em link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (state.mobileMenuOpen) {
                navMenu?.classList.remove('active');
                navToggle?.classList.remove('active');
                navToggle?.setAttribute('aria-expanded', 'false');
                state.mobileMenuOpen = false;
                document.body.style.overflow = '';
            }
        });
    });
    
    // Header scroll effect
    const handleScroll = throttle(() => {
        state.scrollPosition = window.scrollY;
        
        if (header) {
            header.classList.toggle('scrolled', state.scrollPosition > CONFIG.scrollThreshold);
        }
        
        // Atualiza link ativo baseado na seção visível
        updateActiveNavLink();
        
        // Mostra/esconde botão voltar ao topo
        updateBackToTop();
    }, CONFIG.throttleDelay);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Smooth scroll para links internos
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href?.startsWith('#')) {
                e.preventDefault();
                const target = $(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// Atualiza link de navegação ativo
function updateActiveNavLink() {
    const sections = $$('section[id]');
    const navLinks = $$('.nav__link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (state.scrollPosition >= sectionTop && 
            state.scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

/* =====================================================
   5. TEMA (DARK/LIGHT MODE)
   ===================================================== */

function initThemeToggle() {
    const themeToggle = $('#theme-toggle');
    
    if (!themeToggle) return;
    
    // Verifica preferência salva ou do sistema
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    state.currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(state.currentTheme);
    
    // Toggle de tema
    themeToggle.addEventListener('click', () => {
        state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(state.currentTheme);
        localStorage.setItem('theme', state.currentTheme);
        
        // Animação de transição
        themeToggle.style.transform = 'rotate(360deg) scale(1.2)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 500);
    });
    
    // Escuta mudanças na preferência do sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            state.currentTheme = e.matches ? 'dark' : 'light';
            applyTheme(state.currentTheme);
        }
    });
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Atualiza meta theme-color
    const metaThemeColor = $('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#1a1a2e' : '#7c3aed');
    }
}

/* =====================================================
   6. CURSOR MÁGICO
   ===================================================== */

function initMagicCursor() {
    // Verifica se dispositivo suporta hover (não é touch)
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        return;
    }
    
    const cursor = $('.magic-cursor');
    const cursorTrail = $('.magic-cursor-trail');
    
    if (!cursor || !cursorTrail) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let trailX = 0;
    let trailY = 0;
    
    // Atualiza posição do mouse
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Animação suave do cursor
    function animateCursor() {
        // Cursor principal - segue imediatamente
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
        
        // Trail - segue com atraso
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        cursorTrail.style.transform = `translate(${trailX - 20}px, ${trailY - 20}px)`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Efeitos de hover em elementos interativos
    const interactiveElements = $$('a, button, .service-card, .gallery__item, input, textarea, select');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform += ' scale(1.5)';
            cursorTrail.style.transform += ' scale(1.5)';
            cursorTrail.style.borderColor = 'var(--color-secondary)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursorTrail.style.borderColor = '';
        });
    });
}

/* =====================================================
   7. PARTÍCULAS FLUTUANTES
   ===================================================== */

function createFloatingParticles() {
    const container = $('#particles-container');
    
    if (!container) return;
    
    // Limpa partículas existentes
    container.innerHTML = '';
    
    // Cria partículas
    for (let i = 0; i < CONFIG.particleCount; i++) {
        createParticle(container, i);
    }
}

function createParticle(container, index) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    particle.textContent = randomItem(CONFIG.particleEmojis);
    particle.setAttribute('aria-hidden', 'true');
    
    // Posição aleatória
    particle.style.left = `${random(0, 100)}%`;
    particle.style.fontSize = `${random(1, 2.5)}rem`;
    particle.style.opacity = random(0.3, 0.8);
    
    // Duração e delay aleatórios
    const duration = random(15, 30);
    const delay = random(0, 15);
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    
    container.appendChild(particle);
    
    // Recria partícula quando animação termina
    particle.addEventListener('animationend', () => {
        particle.remove();
        createParticle(container, index);
    });
}

/* =====================================================
   8. ANIMAÇÕES DE SCROLL (Intersection Observer)
   ===================================================== */

function initScrollAnimations() {
    // Adiciona atributos de animação aos elementos
    addAnimationAttributes();
    
    const animatedElements = $$('[data-animate]');
    
    if (!animatedElements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Opcional: para de observar após animar
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: CONFIG.animationThreshold,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => observer.observe(el));
}

// Adiciona atributos de animação aos elementos
function addAnimationAttributes() {
    // Seções
    $$('.section__header').forEach(el => {
        el.setAttribute('data-animate', 'fade-up');
    });
    
    // Cards de serviço
    $$('.service-card').forEach((el, i) => {
        el.setAttribute('data-animate', 'fade-up');
        el.setAttribute('data-animate-delay', String((i % 3) * 100 + 100));
    });
    
    // Cards sobre
    $$('.about__card').forEach((el, i) => {
        el.setAttribute('data-animate', 'fade-left');
        el.setAttribute('data-animate-delay', String(i * 150));
    });
    
    // Stats
    $$('.stat-item').forEach((el, i) => {
        el.setAttribute('data-animate', 'zoom-in');
        el.setAttribute('data-animate-delay', String(i * 100));
    });
    
    // Galeria
    $$('.gallery__item').forEach((el, i) => {
        el.setAttribute('data-animate', 'fade-up');
        el.setAttribute('data-animate-delay', String((i % 4) * 100));
    });
    
    // Testimonials
    $$('.testimonial-card').forEach((el, i) => {
        el.setAttribute('data-animate', 'fade-up');
        el.setAttribute('data-animate-delay', String(i * 150));
    });
    
    // Contato
    $$('.info-card').forEach((el, i) => {
        el.setAttribute('data-animate', 'fade-right');
        el.setAttribute('data-animate-delay', String(i * 100));
    });
    
    $('.contact__form')?.setAttribute('data-animate', 'fade-left');
    $('.about__image')?.setAttribute('data-animate', 'fade-right');
}

/* =====================================================
   9. CONTADOR ANIMADO (STATS)
   ===================================================== */

function initCounters() {
    const counters = $$('.stat-number[data-target]');
    
    if (!counters.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !state.countersAnimated) {
                animateCounters(counters);
                state.countersAnimated = true;
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });
    
    // Observa o container de stats
    const statsContainer = $('.about__stats');
    if (statsContainer) {
        observer.observe(statsContainer);
    }
}

function animateCounters(counters) {
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const duration = CONFIG.counterDuration;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out-expo)
            const easeOutExpo = 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(target * easeOutExpo);
            
            counter.textContent = current.toLocaleString('pt-BR');
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString('pt-BR');
            }
        }
        
        requestAnimationFrame(updateCounter);
    });
}

/* =====================================================
   10. GALERIA COM FILTROS
   ===================================================== */

function initGallery() {
    const filterBtns = $$('.filter-btn');
    const galleryItems = $$('.gallery__item');
    
    if (!filterBtns.length || !galleryItems.length) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Atualiza estado dos botões
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            
            // Filtra itens
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                const shouldShow = filter === 'all' || category === filter;
                
                if (shouldShow) {
                    item.classList.remove('hidden');
                    item.style.animation = 'pop-in 0.5s ease forwards';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
    
    // Lightbox para galeria (simulado)
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const emoji = item.querySelector('.gallery__emoji')?.textContent;
            const label = item.querySelector('.gallery__label')?.textContent;
            
            // Aqui poderia abrir um modal com a imagem
            // Por enquanto, apenas mostra um efeito visual
            item.style.animation = 'tada 0.8s ease';
            setTimeout(() => {
                item.style.animation = '';
            }, 800);
        });
    });
}

/* =====================================================
   11. CARROSSEL DE DEPOIMENTOS
   ===================================================== */

function initTestimonials() {
    const carousel = $('.testimonials__carousel');
    const cards = $$('.testimonial-card');
    const dots = $$('.testimonials__dots .dot');
    const prevBtn = $('.testimonial-nav-btn[data-direction="prev"]');
    const nextBtn = $('.testimonial-nav-btn[data-direction="next"]');
    
    if (!carousel || cards.length <= 1) return;
    
    let currentIndex = 0;
    let autoPlayInterval;
    
    // Em mobile, transforma em carrossel
    function updateCarousel() {
        if (window.innerWidth <= 1024) {
            cards.forEach((card, i) => {
                card.style.display = i === currentIndex ? 'block' : 'none';
            });
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        } else {
            // Em desktop, mostra todos
            cards.forEach(card => {
                card.style.display = '';
            });
        }
    }
    
    function goToSlide(index) {
        currentIndex = (index + cards.length) % cards.length;
        updateCarousel();
    }
    
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    // Event listeners
    prevBtn?.addEventListener('click', prevSlide);
    nextBtn?.addEventListener('click', nextSlide);
    
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => goToSlide(i));
    });
    
    // Auto-play em mobile
    function startAutoPlay() {
        if (window.innerWidth <= 1024) {
            autoPlayInterval = setInterval(nextSlide, 5000);
        }
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Pausa auto-play ao interagir
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    
    // Inicia
    updateCarousel();
    startAutoPlay();
    
    // Atualiza ao redimensionar
    window.addEventListener('resize', debounce(() => {
        stopAutoPlay();
        updateCarousel();
        startAutoPlay();
    }, 250));
}

/* =====================================================
   12. FORMULÁRIO DE CONTATO
   ===================================================== */

function initContactForm() {
    const form = $('#contact-form');
    
    if (!form) return;
    
    const inputs = form.querySelectorAll('.form-input');
    const submitBtn = form.querySelector('button[type="submit"]');
    const successMsg = form.querySelector('.form-success');
    
    // Validação em tempo real
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
    
    // Máscara de telefone
    const phoneInput = form.querySelector('#phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            
            if (value.length > 6) {
                value = `(${value.slice(0,2)}) ${value.slice(2,7)}-${value.slice(7)}`;
            } else if (value.length > 2) {
                value = `(${value.slice(0,2)}) ${value.slice(2)}`;
            } else if (value.length > 0) {
                value = `(${value}`;
            }
            
            e.target.value = value;
        });
    }
    
    // Submit do formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Valida todos os campos
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            // Scroll para primeiro erro
            const firstError = form.querySelector('.form-input.error');
            firstError?.focus();
            return;
        }
        
        // Simula envio
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            // Simula delay de envio
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Sucesso!
            successMsg.classList.add('show');
            form.reset();
            
            // Confetti celebration!
            createConfetti();
            
            // Esconde mensagem após 5 segundos
            setTimeout(() => {
                successMsg.classList.remove('show');
            }, 5000);
            
        } catch (error) {
            console.error('Erro ao enviar:', error);
            alert('Ops! Algo deu errado. Tente novamente.');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

// Validação de campo
function validateField(input) {
    const errorElement = input.parentElement.querySelector('.form-error');
    let errorMessage = '';
    
    // Remove erro anterior
    input.classList.remove('error');
    if (errorElement) errorElement.textContent = '';
    
    // Verifica se é obrigatório e está vazio
    if (input.hasAttribute('required') && !input.value.trim()) {
        errorMessage = 'Este campo é obrigatório';
    }
    
    // Validações específicas
    else if (input.type === 'email' && input.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
            errorMessage = 'Digite um e-mail válido';
        }
    }
    
    else if (input.id === 'phone' && input.value) {
        const phoneDigits = input.value.replace(/\D/g, '');
        if (phoneDigits.length < 10 || phoneDigits.length > 11) {
            errorMessage = 'Digite um telefone válido';
        }
    }
    
    else if (input.id === 'name' && input.value) {
        if (input.value.trim().length < 3) {
            errorMessage = 'Nome muito curto';
        }
    }
    
    else if (input.id === 'message' && input.value) {
        if (input.value.trim().length < 10) {
            errorMessage = 'Mensagem muito curta';
        }
    }
    
    // Mostra erro se houver
    if (errorMessage) {
        input.classList.add('error');
        if (errorElement) {
            errorElement.textContent = errorMessage;
        }
        return false;
    }
    
    return true;
}

/* =====================================================
   13. NEWSLETTER
   ===================================================== */

function initNewsletter() {
    const form = $('#newsletter-form');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button');
        
        if (!emailInput.value.trim()) return;
        
        // Valida email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            emailInput.style.borderColor = '#ef4444';
            return;
        }
        
        // Simula envio
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Sucesso
        submitBtn.innerHTML = '<i class="fas fa-check"></i>';
        submitBtn.style.background = '#22c55e';
        emailInput.value = '';
        
        // Reset após 3 segundos
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
    });
}

/* =====================================================
   14. BOTÃO VOLTAR AO TOPO
   ===================================================== */

function initBackToTop() {
    const backToTop = $('#back-to-top');
    
    if (!backToTop) return;
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function updateBackToTop() {
    const backToTop = $('#back-to-top');
    
    if (backToTop) {
        backToTop.classList.toggle('visible', state.scrollPosition > 500);
    }
}

/* =====================================================
   15. EFEITOS DE CONFETTI
   ===================================================== */

function createConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    container.setAttribute('aria-hidden', 'true');
    document.body.appendChild(container);
    
    const colors = ['#7c3aed', '#f472b6', '#fbbf24', '#22c55e', '#3b82f6', '#ef4444'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${random(0, 100)}%`;
        confetti.style.backgroundColor = randomItem(colors);
        confetti.style.animationDuration = `${random(2, 4)}s`;
        confetti.style.animationDelay = `${random(0, 1)}s`;
        container.appendChild(confetti);
    }
    
    // Remove após animação
    setTimeout(() => {
        container.remove();
    }, 5000);
}

/* =====================================================
   16. TILT EFFECT (Cards 3D)
   ===================================================== */

function initTiltEffect() {
    const tiltElements = $$('[data-tilt]');
    
    if (!tiltElements.length) return;
    
    // Verifica se não é dispositivo touch
    if (!window.matchMedia('(hover: hover)').matches) return;
    
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });
}

/* =====================================================
   17. ACESSIBILIDADE
   ===================================================== */

function initAccessibility() {
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#home';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Pular para o conteúdo';
    skipLink.style.cssText = `
        position: fixed;
        top: -100%;
        left: 50%;
        transform: translateX(-50%);
        background: var(--color-primary);
        color: white;
        padding: 1rem 2rem;
        border-radius: 0 0 1rem 1rem;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-100%';
    });
    
    document.body.prepend(skipLink);
    
    // Gerencia foco no menu mobile
    const navMenu = $('#nav-menu');
    const navToggle = $('#nav-toggle');
    
    if (navMenu && navToggle) {
        // Trap focus no menu aberto
        navMenu.addEventListener('keydown', (e) => {
            if (!navMenu.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                navToggle.click();
                navToggle.focus();
            }
        });
    }
}

/* =====================================================
   18. PERFORMANCE OPTIMIZATIONS
   ===================================================== */

function initPerformanceOptimizations() {
    // Lazy load de imagens
    if ('IntersectionObserver' in window) {
        const lazyImages = $$('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Prefetch de links em hover
    const prefetchedLinks = new Set();
    
    $$('a[href^="#"]').forEach(link => {
        link.addEventListener('mouseenter', () => {
            const href = link.getAttribute('href');
            if (!prefetchedLinks.has(href)) {
                prefetchedLinks.add(href);
            }
        }, { once: true });
    });
}

/* =====================================================
   19. SERVICE WORKER REGISTRATION
   ===================================================== */

async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            // Service worker seria registrado aqui se existisse
            // await navigator.serviceWorker.register('/sw.js');
            console.log('✨ Mundo Mágico carregado com sucesso!');
        } catch (error) {
            console.log('Service Worker não disponível');
        }
    }
}

/* =====================================================
   20. INICIALIZAÇÃO PRINCIPAL
   ===================================================== */

function init() {
    // Inicializa loading primeiro
    initLoadingScreen();
    
    // Aguarda DOM estar pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAllFeatures);
    } else {
        initAllFeatures();
    }
}

function initAllFeatures() {
    initNavigation();
    initThemeToggle();
    initMagicCursor();
    initCounters();
    initGallery();
    initTestimonials();
    initContactForm();
    initNewsletter();
    initBackToTop();
    initTiltEffect();
    initAccessibility();
    initPerformanceOptimizations();
    registerServiceWorker();
    
    console.log('🦄 Bem-vindo ao Mundo Mágico! ✨');
}

// Inicia a aplicação
init();
