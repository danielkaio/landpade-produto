// Menu Mobile
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Formulário de Contato
const contactForm = document.getElementById('contactForm');

contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    // Coletar dados do formulário
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Validar dados
    if (!data.nome || !data.email || !data.assunto || !data.mensagem) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Por favor, insira um email válido.');
        return;
    }

    // Simular envio (em produção, isso seria enviado para um servidor)
    console.log('Dados do formulário:', data);

    // Opção 1: Abrir email padrão
    const mailtoLink = `mailto:contato@consultoria.com.br?subject=${encodeURIComponent(data.assunto)}&body=${encodeURIComponent(
        `Nome: ${data.nome}\nEmail: ${data.email}\n\nMensagem:\n${data.mensagem}`
    )}`;
    window.location.href = mailtoLink;

    // Opção 2: Mostrar mensagem de sucesso (descomente para usar em vez da opção 1)
    // alert('Obrigado por sua mensagem! Entraremos em contato em breve.');
    // contactForm.reset();
});

// Scroll suave para seções
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Adicionar classe ativa ao navlink baseado na posição do scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Efeito de fade in ao scroll (opcional)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .about-content').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});
