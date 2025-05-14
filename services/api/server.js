const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

// Configuration
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/forum';
const IS_TEST_ENV = process.env.NODE_ENV === 'test';

// Initialisation de l'application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
if (!IS_TEST_ENV) {
  app.use(morgan('dev'));
}

// Modèles
const messageSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

// Contrôleurs
const messageController = {
  async getAll(req, res) {
    try {
      const messages = await Message.find().sort({ createdAt: -1 });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
    }
  },

  async create(req, res) {
    try {
      const { username, content } = req.body;

      if (!username || !content) {
        return res.status(400).json({ error: 'Le pseudonyme et le contenu sont requis' });
      }

      const newMessage = new Message({ username, content });
      await newMessage.save();

      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la création du message' });
    }
  }
};

// Routes
app.get('/api/messages', messageController.getAll);
app.post('/api/messages', messageController.create);

// Connexion à la base de données
const connectDB = async () => {
  try {
    if (!IS_TEST_ENV && mongoose.connection.readyState === 0) {
      await mongoose.connect(DATABASE_URL);
      console.log('Connexion à MongoDB réussie');
    }
  } catch (err) {
    console.error('Erreur de connexion à MongoDB:', err);
  }
};

// Démarrage du serveur
let server;
if (require.main === module) {
  connectDB();
  server = app.listen(PORT, () => {
    console.log(`API du forum en écoute sur le port ${PORT}`);
  });
} else {
  connectDB();
}

module.exports = { app, server };