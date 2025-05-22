const express = require('express');
const jwt = require('jsonwebtoken');
const Utilisateur = require('../modeles/Utilisateur');
const routeur = express.Router();

// Génération du token JWT
const genererToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Route d'inscription
routeur.post('/inscription', async (req, res) => {
  try {
    const { nomUtilisateur, email, motDePasse } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const utilisateurExistant = await Utilisateur.findOne({
      $or: [{ email }, { nomUtilisateur }]
    });

    if (utilisateurExistant) {
      return res.status(400).json({
        message: 'Un utilisateur avec cet email ou nom d\'utilisateur existe déjà'
      });
    }

    // Créer nouvel utilisateur
    const nouvelUtilisateur = new Utilisateur({
      nomUtilisateur,
      email,
      motDePasse
    });

    await nouvelUtilisateur.save();

    const token = genererToken(nouvelUtilisateur._id);

    res.status(201).json({
      message: 'Inscription réussie',
      token,
      utilisateur: {
        id: nouvelUtilisateur._id,
        nomUtilisateur: nouvelUtilisateur.nomUtilisateur,
        email: nouvelUtilisateur.email
      }
    });

  } catch (erreur) {
    res.status(400).json({
      message: 'Erreur lors de l\'inscription',
      erreur: erreur.message
    });
  }
});

// Route de connexion
routeur.post('/connexion', async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    // Trouver l'utilisateur
    const utilisateur = await Utilisateur.findOne({ email });
    
    if (!utilisateur) {
      return res.status(400).json({
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier le mot de passe
    const motDePasseValide = await utilisateur.comparerMotDePasse(motDePasse);
    
    if (!motDePasseValide) {
      return res.status(400).json({
        message: 'Email ou mot de passe incorrect'
      });
    }

    const token = genererToken(utilisateur._id);

    res.json({
      message: 'Connexion réussie',
      token,
      utilisateur: {
        id: utilisateur._id,
        nomUtilisateur: utilisateur.nomUtilisateur,
        email: utilisateur.email
      }
    });

  } catch (erreur) {
    res.status(500).json({
      message: 'Erreur serveur',
      erreur: erreur.message
    });
  }
});

module.exports = routeur;
