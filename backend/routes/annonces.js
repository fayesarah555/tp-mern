const express = require('express');
const Annonce = require('../models/Annonce');
const verifierToken = require('../middleware/authentification');
const routeur = express.Router();

// Obtenir toutes les annonces (PUBLIC)
routeur.get('/', async (req, res) => {
  try {
    const { categorie } = req.query;
    let filtre = {};
    
    if (categorie && categorie !== 'Toutes') {
      filtre.categorie = categorie;
    }

    const annonces = await Annonce.find(filtre)
      .populate('auteur', 'nomUtilisateur')
      .sort({ createdAt: -1 });

    res.json(annonces);
  } catch (erreur) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des annonces',
      erreur: erreur.message
    });
  }
});
routeur.put('/:id', verifierToken, async (req, res) => {
    try {
      const { titre, description, prix, categorie } = req.body;
      
      // Trouver l'annonce
      const annonce = await Annonce.findById(req.params.id);
      
      if (!annonce) {
        return res.status(404).json({
          message: 'Annonce non trouvée'
        });
      }
  
      // Vérifier que l'utilisateur est le propriétaire de l'annonce
      if (annonce.auteur.toString() !== req.utilisateur._id.toString()) {
        return res.status(403).json({
          message: 'Accès refusé. Vous ne pouvez modifier que vos propres annonces.'
        });
      }
  
      // Mettre à jour l'annonce
      const annonceModifiee = await Annonce.findByIdAndUpdate(
        req.params.id,
        {
          titre,
          description,
          prix,
          categorie
        },
        { new: true, runValidators: true }
      ).populate('auteur', 'nomUtilisateur');
  
      res.json({
        message: 'Annonce modifiée avec succès',
        annonce: annonceModifiee
      });
  
    } catch (erreur) {
      res.status(400).json({
        message: 'Erreur lors de la modification de l\'annonce',
        erreur: erreur.message
      });
    }
  });
  
// Obtenir une annonce par ID (PUBLIC)
routeur.get('/:id', async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id)
      .populate('auteur', 'nomUtilisateur email');
    
    if (!annonce) {
      return res.status(404).json({
        message: 'Annonce non trouvée'
      });
    }

    res.json(annonce);
  } catch (erreur) {
    res.status(500).json({
      message: 'Erreur lors de la récupération de l\'annonce',
      erreur: erreur.message
    });
  }
});

// Créer une annonce (PROTÉGÉ)
routeur.post('/', verifierToken, async (req, res) => {
  try {
    const { titre, description, prix, categorie } = req.body;

    const nouvelleAnnonce = new Annonce({
      titre,
      description,
      prix,
      categorie,
      auteur: req.utilisateur._id // ID récupéré automatiquement du token JWT
    });

    await nouvelleAnnonce.save();
    
    const annonceComplete = await Annonce.findById(nouvelleAnnonce._id)
      .populate('auteur', 'nomUtilisateur');

    res.status(201).json({
      message: 'Annonce créée avec succès',
      annonce: annonceComplete
    });

  } catch (erreur) {
    res.status(400).json({
      message: 'Erreur lors de la création de l\'annonce',
      erreur: erreur.message
    });
  }
});

// Supprimer une annonce (PROTÉGÉ)
routeur.delete('/:id', verifierToken, async (req, res) => {
  try {
    const annonce = await Annonce.findByIdAndDelete(req.params.id);
    
    if (!annonce) {
      return res.status(404).json({
        message: 'Annonce non trouvée'
      });
    }

    res.json({
      message: 'Annonce supprimée avec succès'
    });

  } catch (erreur) {
    res.status(500).json({
      message: 'Erreur lors de la suppression de l\'annonce',
      erreur: erreur.message
    });
  }
});

module.exports = routeur;