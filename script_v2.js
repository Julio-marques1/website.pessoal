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
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevButton = carousel.querySelector('.carousel-control.prev');
        const nextButton = carousel.querySelector('.carousel-control.next');
        const indicatorsContainer = carousel.querySelector('.carousel-indicators');
        let currentSlide = 0;
        let indicators = [];
        let autoplayInterval = null; // Variável para guardar o ID do intervalo

        function showSlide(index) {
            slides.forEach((slide, i) => {
                // Controla a visibilidade e fade com a classe 'active'
                slide.classList.toggle('active', i === index);
            });
            if (indicators.length > 0) {
                 indicators.forEach((indicator, i) => {
                    indicator.classList.toggle('active', i === index);
                });
            }
            currentSlide = index;
        }

        function nextSlide() {
            let newIndex = (currentSlide + 1) % slides.length;
            showSlide(newIndex);
        }

        function prevSlide() {
            let newIndex = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(newIndex);
        }

        // Função para iniciar o autoplay
        function startAutoplay() {
            // Limpa intervalo anterior se existir
            if (autoplayInterval) clearInterval(autoplayInterval);
            // Inicia novo intervalo
            autoplayInterval = setInterval(nextSlide, 5000); // Muda a cada 5 segundos
        }

        // Função para parar o autoplay (útil ao interagir manualmente)
        function stopAutoplay() {
            if (autoplayInterval) clearInterval(autoplayInterval);
        }

        // Criação dos indicadores
        if (indicatorsContainer) {
             slides.forEach((_, i) => {
                const indicator = document.createElement('span');
                indicator.addEventListener('click', () => {
                    stopAutoplay(); // Para autoplay ao clicar no indicador
                    showSlide(i);
                    startAutoplay(); // Reinicia autoplay (opcional, pode remover ser removido)
                });
                indicatorsContainer.appendChild(indicator);
                indicators.push(indicator);
            });
        }
       

        // Event Listeners para botões
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                stopAutoplay();
                nextSlide();
                startAutoplay(); // Reinicia autoplay
            });
        }
        if (prevButton) {
             prevButton.addEventListener('click', () => {
                stopAutoplay();
                prevSlide();
                startAutoplay(); // Reinicia autoplay
            });
        }

        // Mostrar o primeiro slide inicialmente
        if (slides.length > 0) {
            showSlide(0);
            startAutoplay(); // Inicia o autoplay
        }
        
        // Opcional: Parar autoplay quando o mouse está sobre o carrossel
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
    }

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
                // Opcional: parar de observar após animar uma vez
                // observer.unobserve(entry.target);
            }
             else { // Opcional: reverter animação ao sair da tela
                 entry.target.style.opacity = '0';
                 // Ajuste a direção do translate Y para o efeito desejado
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
        // Define estado inicial para animação
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
                // Adicionar feedback visual ao campo, se desejar
            }
            if (!email) { // Poderia adicionar validação de formato de email
                isValid = false;
            }
             if (!mensagem) {
                isValid = false;
            }

            if (isValid) {
                formStatusV2.textContent = `Obrigado, ${nome}! Sua mensagem foi enviada com sucesso!`;
                formStatusV2.style.color = 'green';
                contactFormV2.reset();
            } else {
                formStatusV2.textContent = 'Por favor, preencha todos os campos obrigatórios.';
                formStatusV2.style.color = 'red';
            }

            // Limpa a mensagem de status após um tempo
            setTimeout(() => {
                formStatusV2.textContent = '';
            }, 6000);
        });
    }

}); // Fim do DOMContentLoaded

