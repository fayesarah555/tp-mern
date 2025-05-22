const mongoose = require('mongoose');

const schemaAnnonce = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, 'Le titre est obligatoire'],
    trim: true,
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description est obligatoire'],
    maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères']
  },
  prix: {
    type: Number,
    required: [true, 'Le prix est obligatoire'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  categorie: {
    type: String,
    required: [true, 'La catégorie est obligatoire'],
    enum: ['Immobilier', 'Véhicules', 'Électronique', 'Maison', 'Vêtements', 'Loisirs', 'Autres']
  },
  auteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Annonce', schemaAnnonce);