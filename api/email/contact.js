module.exports = async (req, res) => {
  try {
    // Garantir headers JSON e CORS
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    console.log('🔵 [api/email/contact] Requisição:', {
      method: req.method,
      path: req.url,
      bodyKeys: Object.keys(req.body || {}),
    });

    if (req.method === 'OPTIONS') {
      console.log('✅ [api/email/contact] OPTIONS ok');
      return res.status(200).json({ ok: true });
    }

    if (req.method !== 'POST') {
      console.log('🔴 [api/email/contact] Método não permitido:', req.method);
      return res.status(405).json({
        success: false,
        message: 'Apenas POST é aceito',
      });
    }

    // Lazy load para evitar erros de inicialização
    console.log('🔵 [api/email/contact] Carregando módulos...');
    let emailValidator, emailService;
    
    try {
      emailValidator = require('../../utils/emailValidator');
      emailService = require('../../services/emailService');
      console.log('✅ [api/email/contact] Módulos carregados');
    } catch (importError) {
      console.error('🔴 [api/email/contact] Erro ao carregar módulos:', importError.message);
      return res.status(500).json({
        success: false,
        message: 'Erro ao carregar módulos da aplicação',
        error: importError.message,
      });
    }

    // Extrair dados
    const { name, email, message } = req.body || {};
    console.log('📋 [api/email/contact] Dados:', { name, email, message });

    // Validar dados
    console.log('🔵 [api/email/contact] Validando...');
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

    // Enviar email
    console.log('🔵 [api/email/contact] Enviando email...');
    const result = await emailService.sendContactEmail({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });

    console.log('✅ [api/email/contact] Sucesso!');
    return res.status(200).json({
      success: true,
      message: 'Email enviado com sucesso!',
      data: result,
    });

  } catch (error) {
    console.error('🔴 [api/email/contact] ERRO CAPTURADO:', error.message);
    console.error('Stack:', error.stack);

    // Tentar responder com erro JSON
    try {
      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          message: 'Erro ao enviar email',
          error: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        });
      }
    } catch (responseError) {
      console.error('🔴 Erro ao enviar resposta:', responseError.message);
    }
  }
};
