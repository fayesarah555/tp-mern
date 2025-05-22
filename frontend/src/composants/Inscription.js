import React, { useState } from 'react';
import { authentificationService } from '../services/api';

const Inscription = ({ onConnexion }) => {
  const [donneesFormulaire, setDonneesFormulaire] = useState({
    nomUtilisateur: '',
    email: '',
    motDePasse: ''
  });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const gererChangement = (e) => {
    setDonneesFormulaire({
      ...donneesFormulaire,
      [e.target.name]: e.target.value
    });
    setErreur('');
  };

  const gererSoumission = async (e) => {
    e.preventDefault();
    setChargement(true);
    setErreur('');

    // Validation côté client
    if (donneesFormulaire.motDePasse.length < 6) {
      setErreur('Le mot de passe doit contenir au moins 6 caractères');
      setChargement(false);
      return;
    }

    try {
      const reponse = await authentificationService.inscription(donneesFormulaire);
      const { token, utilisateur } = reponse.data;
      
      onConnexion(token, utilisateur);
      
    } catch (erreur) {
      setErreur(
        erreur.response?.data?.message || 
        'Erreur lors de l\'inscription'
      );
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="page-authentification">
      <div className="formulaire-container">
        <h2>Inscription</h2>
        
        {erreur && (
          <div className="message-erreur">
            {erreur}
          </div>
        )}
        
        <form onSubmit={gererSoumission} className="formulaire-auth">
          <div className="groupe-champ">
            <label htmlFor="nomUtilisateur">Nom d'utilisateur :</label>
            <input
              type="text"
              id="nomUtilisateur"
              name="nomUtilisateur"
              value={donneesFormulaire.nomUtilisateur}
              onChange={gererChangement}
              required
              disabled={chargement}
            />
          </div>
          
          <div className="groupe-champ">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              name="email"
              value={donneesFormulaire.email}
              onChange={gererChangement}
              required
              disabled={chargement}
            />
          </div>
          
          <div className="groupe-champ">
            <label htmlFor="motDePasse">Mot de passe :</label>
            <input
              type="password"
              id="motDePasse"
              name="motDePasse"
              value={donneesFormulaire.motDePasse}
              onChange={gererChangement}
              required
              minLength="6"
              disabled={chargement}
            />
            <small>Minimum 6 caractères</small>
          </div>
          
          <button 
            type="submit" 
            className="btn-principal"
            disabled={chargement}
          >
            {chargement ? 'Inscription...' : 'S\'inscrire'}
          </button>
        </form>
        
        <p className="lien-alternatif">
          Déjà un compte ? 
          <a href="/connexion"> Se connecter</a>
        </p>
      </div>
    </div>
  );
};

export default Inscription;