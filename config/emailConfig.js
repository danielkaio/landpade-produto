module.exports = {
  // Chave da API do Resend (deve estar em .env)
  apiKey: process.env.RESEND_API_KEY,

  // Email padrão do remetente (deve estar em .env)
  fromEmail: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',

  // Nome do remetente
  fromName: 'PDI - Institucional',

  // Email de suporte (onde cópias serão enviadas)
  supportEmail: process.env.SUPPORT_EMAIL || 'seu-email@example.com',

  // Configuração de validação
  validation: {
    maxLengthName: 100,
    maxLengthEmail: 255,
    maxLengthMessage: 5000,
  },
};
