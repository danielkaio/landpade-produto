/**
 * Configuração do BrowserSync
 * Faz proxy para o servidor Express na porta 3000
 */

module.exports = {
  // Proxy para o servidor Express
  proxy: "http://localhost:3000",
  
  // Arquivos a monitorar para reload
  files: [
    "index.html",
    "css/**/*.css",
    "js/**/*.js",
    "src/**/*.js"
  ],
  
  // Porta do BrowserSync
  port: 3001,
  
  // URL base
  baseDir: "./",
  
  // Notificações
  notify: false,
  
  // Reload em tempo real
  reloadOnRestart: true,
  
  // Atraso antes do reload
  reloadDelay: 500,
  
  // Middleware para garantir que vai para Express
  middleware: function(req, res, next) {
    next();
  }
};
