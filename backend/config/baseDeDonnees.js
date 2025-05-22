const mongoose = require('mongoose');

const connecterBaseDeDonnees = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connexion à MongoDB réussie');
  } catch (erreur) {
    console.error('❌ Erreur de connexion à MongoDB:', erreur.message);
    process.exit(1);
  }
};

module.exports = connecterBaseDeDonnees;