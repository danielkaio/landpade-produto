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

contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('✅ Formulário detectado e enviando...');

    // Coletar dados do formulário
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    console.log('📋 Dados coletados:', data);

    // Validar campos obrigatórios
    if (!data.nome || !data.email || !data.mensagem) {
        console.warn('⚠️ Campos vazios detectados');
        alert('Por favor, preencha todos os campos obrigatórios (Nome, Email e Mensagem).');
        return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        console.warn('⚠️ Email inválido:', data.email);
        alert('Por favor, insira um email válido.');
        return;
    }

    // Preparar dados para envio ao servidor
    const payload = {
        name: data.nome,
        email: data.email,
        message: data.mensagem,
    };

    try {
        // Enviar para o servidor via POST
    
        const response = await fetch('/api/email/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        

        if (response.ok && result.success) {
        
            alert('✓ Obrigado por sua mensagem! Entraremos em contato em breve.');
            contactForm.reset();
        } else {
            console.error('❌ Erro na resposta:', result);
            alert(`❌ Erro ao enviar: ${result.message || 'Tente novamente mais tarde.'}`);
        }
    } catch (error) {
        console.error('❌ ERRO NA REQUISIÇÃO:', error);
        alert('❌ Erro ao conectar com o servidor. Verifique sua conexão e tente novamente.');
    }
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
