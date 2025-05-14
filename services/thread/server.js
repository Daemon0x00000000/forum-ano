const express = require('express');
const axios = require('axios');
const path = require('path');

// Configuration
const CONFIG = {
  port: process.env.PORT || 80,
  apiUrl: process.env.API_URL || 'http://api:3000',
  isTestEnv: process.env.NODE_ENV === 'test'
};

// Initialisation de l'application
const threadApp = express();

// Configuration du moteur de template
threadApp.set('view engine', 'ejs');
threadApp.set('views', path.join(__dirname, 'views'));
threadApp.use(express.static(path.join(__dirname, 'public')));

// Middleware
threadApp.use(express.json());
threadApp.use(express.urlencoded({ extended: true }));

// Contrôleurs
const messageController = {
  async renderThreadPage(req, res) {
    try {
      // En mode test, ne pas faire d'appel API réel
      if (CONFIG.isTestEnv) {
        return res.render('index', { messages: [] });
      }

      const response = await axios.get(`${CONFIG.apiUrl}/api/messages`);
      res.render('index', { messages: response.data });
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error.message);
      res.render('index', {
        messages: [],
        error: 'Impossible de récupérer les messages. Veuillez réessayer plus tard.'
      });
    }
  },

  // Point de terminaison pour les tests
  testEndpoint(req, res) {
    res.json({ success: true });
  }
};

// Routes
threadApp.get('/', messageController.renderThreadPage);
threadApp.get('/messages', messageController.testEndpoint);

// Fonction de démarrage du serveur
const startServer = () => {
  const httpServer = threadApp.listen(CONFIG.port, () => {
    console.log(`Service Thread en écoute sur le port ${CONFIG.port}`);
  });

  return httpServer;
};

// Démarrage du serveur seulement si ce fichier est exécuté directement
let threadServer;
if (require.main === module) {
  threadServer = startServer();
}

module.exports = threadApp;