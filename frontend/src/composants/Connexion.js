import React, { useState } from 'react';
import { authentificationService } from '../services/api';

const Connexion = ({ onConnexion }) => {
  const [donneesFormulaire, setDonneesFormulaire] = useState({
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
    setErreur(''); // Effacer l'erreur lors de la saisie
  };

  const gererSoumission = async (e) => {
    e.preventDefault();
    setChargement(true);
    setErreur('');

    try {
      const reponse = await authentificationService.connexion(donneesFormulaire);
      const { token, utilisateur } = reponse.data;
      
      onConnexion(token, utilisateur);
      
    } catch (erreur) {
      setErreur(
        erreur.response?.data?.message || 
        'Erreur lors de la connexion'
      );
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="page-authentification">
      <div className="formulaire-container">
        <h2>Connexion</h2>
        
        {erreur && (
          <div className="message-erreur">
            {erreur}
          </div>
        )}
        
        <form onSubmit={gererSoumission} className="formulaire-auth">
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
              disabled={chargement}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-principal"
            disabled={chargement}
          >
            {chargement ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        
        <p className="lien-alternatif">
          Pas encore de compte ? 
          <a href="/inscription"> S'inscrire</a>
        </p>
      </div>
    </div>
  );
};

export default Connexion;