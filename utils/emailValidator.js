/**
 * Validador de Email
 * Responsabilidade: Validar dados de formulários antes do envio
 */

const emailConfig = require('../config/emailConfig');

class EmailValidator {
  /**
   * Valida formulário de contato
   */
  validateContactForm(data) {
    const errors = [];
    const { name, email, message } = data;

    // Validar nome
    if (!name || name.trim().length === 0) {
      errors.push('Nome é obrigatório');
    } else if (name.length > emailConfig.validation.maxLengthName) {
      errors.push(`Nome não pode exceder ${emailConfig.validation.maxLengthName} caracteres`);
    }

    // Validar email
    if (!email || email.trim().length === 0) {
      errors.push('Email é obrigatório');
    } else if (!this.isValidEmail(email)) {
      errors.push('Email inválido');
    } else if (email.length > emailConfig.validation.maxLengthEmail) {
      errors.push(`Email não pode exceder ${emailConfig.validation.maxLengthEmail} caracteres`);
    }

    // Validar mensagem
    if (!message || message.trim().length === 0) {
      errors.push('Mensagem é obrigatória');
    } else if (message.length > emailConfig.validation.maxLengthMessage) {
      errors.push(`Mensagem não pode exceder ${emailConfig.validation.maxLengthMessage} caracteres`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Valida formato de email
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = new EmailValidator();
