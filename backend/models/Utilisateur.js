const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const schemaUtilisateur = new mongoose.Schema({
  nomUtilisateur: {
    type: String,
    required: [true, 'Le nom d\'utilisateur est obligatoire'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est obligatoire'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  motDePasse: {
    type: String,
    required: [true, 'Le mot de passe est obligatoire'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
  }
}, {
  timestamps: true
});

// Hachage du mot de passe avant sauvegarde
schemaUtilisateur.pre('save', async function(next) {
  if (!this.isModified('motDePasse')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
  next();
});

// Méthode pour comparer les mots de passe
schemaUtilisateur.methods.comparerMotDePasse = async function(motDePasseCandidat) {
  return await bcrypt.compare(motDePasseCandidat, this.motDePasse);
};

module.exports = mongoose.model('Utilisateur', schemaUtilisateur);
