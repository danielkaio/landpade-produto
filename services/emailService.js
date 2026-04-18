/**
 * Serviço de Email
 * Responsabilidade: Lógica de envio de emails via Resend
 */

const { Resend } = require('resend');
const emailConfig = require('../config/emailConfig');

class EmailService {
  constructor() {
    this.resend = null;
  }

  getResendInstance() {
    if (!this.resend) {
      if (!emailConfig.apiKey) {
        throw new Error('RESEND_API_KEY não configurada em variáveis de ambiente');
      }
      this.resend = new Resend(emailConfig.apiKey);
    }
    return this.resend;
  }

  /**
   * Envia email de contato
   * @param {Object} data - Dados do formulário
   * @param {string} data.name - Nome do remetente
   * @param {string} data.email - Email do remetente
   * @param {string} data.message - Mensagem
   * @returns {Promise<Object>} Resposta do Resend
   */
  async sendContactEmail(data) {
    const { name, email, message } = data;

    try {
      const resend = this.getResendInstance();

      // Email para o cliente (confirmação)
      const clientResponse = await resend.emails.send({
        from: `${emailConfig.fromName} <${emailConfig.fromEmail}>`,
        to: email,
        subject: 'Recebemos sua mensagem - PDI Institucional',
        html: this.getClientConfirmationTemplate(name),
      });

      // Email para o suporte
      const supportResponse = await resend.emails.send({
        from: `${emailConfig.fromName} <${emailConfig.fromEmail}>`,
        to: emailConfig.supportEmail,
        replyTo: email,
        subject: `Nova mensagem de contato de ${name}`,
        html: this.getSupportTemplate(name, email, message),
      });

      return supportResponse;
    } catch (error) {
      console.error('Erro ao enviar email:', error.message);
      throw error;
    }
  }

  /**
   * Template de confirmação para o cliente
   */
  getClientConfirmationTemplate(name) {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Obrigado por nos contactar, ${name}!</h2>
          <p>Recebemos sua mensagem com sucesso.</p>
          <p>Nossa equipe responderá em breve.</p>
          <hr>
          <p><small>Este é um email automático. Não responda a este endereço.</small></p>
        </body>
      </html>
    `;
  }

  /**
   * Template de notificação para o suporte
   */
  getSupportTemplate(name, email, message) {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Nova Mensagem de Contato</h2>
          <p><strong>Nome:</strong> ${this.escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${this.escapeHtml(email)}</p>
          <hr>
          <h3>Mensagem:</h3>
          <p>${this.escapeHtml(message).replace(/\n/g, '<br>')}</p>
          <hr>
          <p><small>Clique reply para responder ao cliente.</small></p>
        </body>
      </html>
    `;
  }

  /**
   * Escapa caracteres HTML para evitar XSS
   */
  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
}

// Exportar instância única (Singleton)
module.exports = new EmailService();
