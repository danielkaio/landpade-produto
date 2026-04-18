/**
 * Controlador de Email
 * Responsabilidade: Validar dados e coordenar com o serviço de email
 * 
 * Nota: Este controlador não é mais usado no Vercel.
 * A lógica foi movida para /api/email/contact.js (serverless function).
 * Mantido aqui para referência.
 */

const emailService = require('../services/emailService');
const emailValidator = require('../utils/emailValidator');

class EmailController {
  /**
   * Handle POST /api/email/contact
   * (Deprecated - usar /api/email/contact.js no Vercel)
   */
  async sendContact(req, res) {
    let hasResponded = false;

    try {
      console.log('📨 Recebida requisição POST para /api/email/contact');
      
      const { name, email, message } = req.body;
      console.log('✅ Body recebido:', { name, email, message });

      // Validar dados
      const validation = emailValidator.validateContactForm({
        name,
        email,
        message,
      });

      if (!validation.isValid) {
        console.warn('⚠️ Validação falhou:', validation.errors);
        res.status(400).json({
          success: false,
          errors: validation.errors,
        });
        hasResponded = true;
        return;
      }

      console.log('✅ Validação passou');

      // Enviar email
      console.log('📤 Enviando email...');
      const result = await emailService.sendContactEmail({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
      });

      console.log('✅ Email enviado com sucesso');
      res.status(200).json({
        success: true,
        message: 'Email enviado com sucesso!',
        data: result,
      });
      hasResponded = true;
      
    } catch (error) {
      console.error('❌ ERRO NO CONTROLLER:', error.message);
      console.error('Stack:', error.stack);
      
      if (!hasResponded && !res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Erro ao enviar email. Verifique os logs do servidor.',
          error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error',
        });
        hasResponded = true;
      }
    }
  }
}

module.exports = new EmailController();
