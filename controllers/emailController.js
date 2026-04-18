/**
 * Controlador de Email
 * Responsabilidade: Validar dados e coordenar com o serviço de email
 */

const emailService = require('../services/emailService');
const emailConfig = require('../config/emailConfig');
const emailValidator = require('../utils/emailValidator');

class EmailController {
  /**
   * Handle POST /api/email/contact
   */
  async sendContact(req, res) {
    try {
      const { name, email, message } = req.body;

      // Validar dados
      const validation = emailValidator.validateContactForm({
        name,
        email,
        message,
      });

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors,
        });
      }

      // Enviar email
      const result = await emailService.sendContactEmail({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
      });

      return res.status(200).json({
        success: true,
        message: 'Email enviado com sucesso!',
        data: result,
      });
    } catch (error) {
      console.error('Erro ao enviar email no controller:', error);
      
      // Garantir que responda com JSON
      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          message: 'Erro ao enviar email. Verifique se as variáveis de ambiente estão configuradas.',
          error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error',
        });
      }
    }
  }
}

module.exports = new EmailController();
