const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connecterBaseDeDonnees = require('./config/baseDeDonnees');
const routesAuthentification = require('./routes/authentification');
const routesAnnonces = require('./routes/annonces');

const app = express();
const PORT = process.env.PORT || 5000;

// Connexion à la base de données
connecterBaseDeDonnees();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', routesAuthentification);
app.use('/api/annonces', routesAnnonces);

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API Le Bon Coin - Serveur fonctionnel ✅' });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
