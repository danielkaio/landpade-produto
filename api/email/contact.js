const emailValidator = require('../../utils/emailValidator');
const emailService = require('../../services/emailService');

module.exports = async (req, res) => {
  try {
    // Garantir JSON como resposta
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    
    console.log('🔵 [api/email/contact] Requisição recebida:', {
      method: req.method,
      body: req.body,
    });

    if (req.method === 'OPTIONS') {
      return res.status(200).json({ ok: true });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        message: 'Apenas POST é aceito',
      });
    }

    // Extrair dados
    const { name, email, message } = req.body;

    // Validar dados
    console.log('🔵 [api/email/contact] Validando dados...');
    const validation = emailValidator.validateContactForm({
      name,
      email,
      message,
    });

    if (!validation.isValid) {
      console.warn('🟡 [api/email/contact] Validação falhou:', validation.errors);
      return res.status(400).json({
        success: false,
        errors: validation.errors,
      });
    }

    // Enviar email via serviço
    console.log('🔵 [api/email/contact] Enviando email...');
    const result = await emailService.sendContactEmail({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });

    console.log('✅ [api/email/contact] Email enviado com sucesso');
    return res.status(200).json({
      success: true,
      message: 'Email enviado com sucesso!',
      data: result,
    });

  } catch (error) {
    console.error('🔴 [api/email/contact] ERRO:', error.message);
    console.error('🔴 [api/email/contact] Stack:', error.stack);

    // Resposta de erro sempre em JSON
    return res.status(500).json({
      success: false,
      message: 'Erro ao enviar email. Tente novamente mais tarde.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
