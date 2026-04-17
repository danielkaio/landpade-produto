/**
 * Rotas de Email
 * Responsabilidade: Definir endpoints e conectar com controllers
 */

const express = require('express');
const emailController = require('../controllers/emailController');

const router = express.Router();

/**
 * POST /api/email/contact
 * Enviar email de contato
 */
router.post('/contact', (req, res) => emailController.sendContact(req, res));

module.exports = router;
