const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/Utilisateur');

const verifierToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Accès refusé. Token manquant.' 
      });
    }

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    const utilisateur = await Utilisateur.findById(tokenDecode.id);
    
    if (!utilisateur) {
      return res.status(401).json({ 
        message: 'Token invalide. Utilisateur non trouvé.' 
      });
    }

    req.utilisateur = utilisateur;
    next();
  } catch (erreur) {
    res.status(401).json({ 
      message: 'Token invalide.' 
    });
  }
};

module.exports = verifierToken;