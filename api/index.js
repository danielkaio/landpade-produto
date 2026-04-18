const express = require('express');
const path = require('path');
require('dotenv').config();

const emailRoutes = require('../routes/emailRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));

// Rotas da API
app.use('/api/email', emailRoutes);

// Rota para servir o HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

module.exports = app;
