// script_v2.js - Funcionalidades

document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth Scrolling para Links de Navegação --- 
    const navLinks = document.querySelectorAll('#main-nav a[href^="#"], footer a[href^="#"], a.cta-button[href^="#"], a.cta-button-light[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const headerOffset = document.getElementById('main-header').offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

    // --- Destaque do Link Ativo na Navegação ao Rolar --- 
    const sections = document.querySelectorAll('main section[id]');
    const navLi = document.querySelectorAll('#main-nav ul li a');
    const headerHeight = document.getElementById('main-header').offsetHeight;

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50; // Ajuste o offset conforme necessário
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLi.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${current}`) {
                a.classList.add('active');
            }
        });
        // Caso especial para o topo da página
        if (pageYOffset < sections[0].offsetTop - headerHeight - 50) {
             navLi.forEach(a => a.classList.remove('active'));
             const homeLink = document.querySelector('#main-nav a[href="#hero"]');
             if(homeLink) homeLink.classList.add('active');
        }
    });

    // --- Carrossel de Imagens --- 
    const slides = document.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.carousel-control.prev');
    const nextButton = document.querySelector('.carousel-control.next');
    const indicators = document.querySelectorAll('.carousel-indicators span');
    let currentSlide = 0;
    let autoplayInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            indicators[i].classList.remove('active');
        });
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000); // Muda a cada 5 segundos
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    nextButton.addEventListener('click', () => {
        stopAutoplay();
        nextSlide();
        startAutoplay();
    });

    prevButton.addEventListener('click', () => {
        stopAutoplay();
        prevSlide();
        startAutoplay();
    });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopAutoplay();
            showSlide(index);
            startAutoplay();
        });
    });

    // Inicia o autoplay
    startAutoplay();
    showSlide(currentSlide);

    // --- Animação da Linha do Tempo ---
    // Usando Intersection Observer para performance
    const timelineItems = document.querySelectorAll('.timeline-item-v2');

    const observerOptions = {
        root: null, // Relativo à viewport
        rootMargin: '0px',
        threshold: 0.1 // Aciona quando 10% do item está visível
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            } else {
                entry.target.style.opacity = '0';
                if (entry.boundingClientRect.top > 0) {
                    entry.target.style.transform = 'translateY(50px)'; // Saindo por baixo
                } else {
                    entry.target.style.transform = 'translateY(-50px)'; // Saindo por cima
                }
            }
        });
    };

    const timelineObserver = new IntersectionObserver(observerCallback, observerOptions);

    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
        item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        timelineObserver.observe(item);
    });

    // --- Feedback do Formulário de Contato ---
    const contactFormV2 = document.getElementById('contact-form-v2');
    const formStatusV2 = document.getElementById('form-status-v2');

    if (contactFormV2 && formStatusV2) {
        contactFormV2.addEventListener('submit', function(event) {
            event.preventDefault(); // Previne envio real

            // Validação simples (apenas verifica se não está vazio)
            const nome = document.getElementById('nome-v2').value.trim();
            const email = document.getElementById('email-v2').value.trim();
            const mensagem = document.getElementById('mensagem-v2').value.trim();
            let isValid = true;

            if (!nome) {
                isValid = false;
            }
            if (!email) {
                isValid = false;
            }
            if (!mensagem) {
                isValid = false;
            }

            if (isValid) {
                formStatusV2.textContent = `Obrigado, ${nome}! Sua mensagem foi enviada com sucesso✅`;
                formStatusV2.style.color = 'green';
                contactFormV2.reset();
            } else {
                formStatusV2.textContent = 'Por favor, preencha todos os campos obrigatórios❗';
                formStatusV2.style.color = 'red';
            }

            // Limpa a mensagem de status após um tempo
            setTimeout(() => {
                formStatusV2.textContent = '';
            }, 6000);
        });
    }

}); // Fim do DOMContentLoaded
