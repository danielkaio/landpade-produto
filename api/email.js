const emailController = require('../../controllers/emailController');

export default async function handler(req, res) {
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      await emailController.sendContact(req, res);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      res.status(500).json({ error: 'Erro ao enviar email' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
