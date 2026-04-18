const { Resend } = require('resend');

// ===== Configuração =====
const emailConfig = {
  apiKey: process.env.RESEND_API_KEY,
  fromEmail: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
  fromName: 'PDI - Institucional',
  supportEmail: process.env.SUPPORT_EMAIL || 'seu-email@example.com',
  validation: {
    maxLengthName: 100,
    maxLengthEmail: 255,
    maxLengthMessage: 5000,
  },
};

// ===== Validação =====
function validateContactForm(data) {
  const errors = [];
  const { name, email, message } = data;

  if (!name || name.trim().length === 0) {
    errors.push('Nome é obrigatório');
  } else if (name.length > emailConfig.validation.maxLengthName) {
    errors.push(`Nome não pode exceder ${emailConfig.validation.maxLengthName} caracteres`);
  }

  if (!email || email.trim().length === 0) {
    errors.push('Email é obrigatório');
  } else if (!isValidEmail(email)) {
    errors.push('Email inválido');
  } else if (email.length > emailConfig.validation.maxLengthEmail) {
    errors.push(`Email não pode exceder ${emailConfig.validation.maxLengthEmail} caracteres`);
  }

  if (!message || message.trim().length === 0) {
    errors.push('Mensagem é obrigatória');
  } else if (message.length > emailConfig.validation.maxLengthMessage) {
    errors.push(`Mensagem não pode exceder ${emailConfig.validation.maxLengthMessage} caracteres`);
  }

  return { isValid: errors.length === 0, errors };
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// ===== Serviço de Email =====
async function sendContactEmail(data) {
  const { name, email, message } = data;

  if (!emailConfig.apiKey) {
    throw new Error('RESEND_API_KEY não configurada. Verifique as Environment Variables no Vercel.');
  }

  try {
    console.log('📧 Iniciando envio para:', email);
    const resend = new Resend(emailConfig.apiKey);

    // Email para cliente
    console.log('📤 Enviando confirmação para cliente...');
    await resend.emails.send({
      from: `${emailConfig.fromName} <${emailConfig.fromEmail}>`,
      to: email,
      subject: 'Recebemos sua mensagem - PDI Institucional',
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2>Obrigado por nos contactar, ${name}!</h2>
            <p>Recebemos sua mensagem com sucesso.</p>
            <p>Nossa equipe responderá em breve.</p>
            <hr>
            <p><small>Este é um email automático. Não responda a este endereço.</small></p>
          </body>
        </html>
      `,
    });
    console.log('✅ Email de confirmação enviado');

    // Email para suporte
    console.log('📤 Enviando notificação para suporte...');
    const supportResponse = await resend.emails.send({
      from: `${emailConfig.fromName} <${emailConfig.fromEmail}>`,
      to: emailConfig.supportEmail,
      replyTo: email,
      subject: `Nova mensagem de contato de ${name}`,
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2>Nova Mensagem de Contato</h2>
            <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <hr>
            <h3>Mensagem:</h3>
            <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
            <hr>
            <p><small>Clique reply para responder ao cliente.</small></p>
          </body>
        </html>
      `,
    });
    console.log('✅ Email de suporte enviado');

    return supportResponse;
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error.message);
    throw error;
  }
}

// ===== Handler =====
module.exports = async (req, res) => {
  try {
    // Headers
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    console.log('🔵 Requisição:', { method: req.method });

    if (req.method === 'OPTIONS') {
      return res.status(200).json({ ok: true });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Apenas POST é aceito' });
    }

    const { name, email, message } = req.body || {};
    console.log('📋 Dados:', { name, email, message });

    // Validar
    console.log('🔵 Validando...');
    const validation = validateContactForm({ name, email, message });

    if (!validation.isValid) {
      console.warn('🟡 Validação falhou:', validation.errors);
      return res.status(400).json({ success: false, errors: validation.errors });
    }

    // Enviar
    console.log('🔵 Enviando email...');
    const result = await sendContactEmail({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });

    console.log('✅ Email enviado com sucesso!');
    return res.status(200).json({
      success: true,
      message: 'Email enviado com sucesso!',
      data: result,
    });

  } catch (error) {
    console.error('🔴 ERRO:', error.message);
    console.error('Stack:', error.stack);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao enviar email',
        error: error.message,
      });
    }
  }
};
