const emailController = require('../../controllers/emailController');

module.exports = async (req, res) => {
  try {
    // Definir headers primeiro
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ 
        success: false,
        message: 'Método não permitido' 
      });
    }

    // Chamar controller
    await emailController.sendContact(req, res);
    
  } catch (error) {
    console.error('🔴 ERRO CRÍTICO NO HANDLER:', error);
    console.error('Stack:', error.stack);
    
    // Enviar resposta de erro garantidamente JSON
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
      });
    }
  }
};
