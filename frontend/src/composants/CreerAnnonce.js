import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { annoncesService } from '../services/api';

const CreerAnnonce = () => {
  const navigate = useNavigate();
  const [donneesFormulaire, setDonneesFormulaire] = useState({
    titre: '',
    description: '',
    prix: '',
    categorie: 'Électronique'
  });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const categories = [
    'Immobilier', 'Véhicules', 'Électronique', 
    'Maison', 'Vêtements', 'Loisirs', 'Autres'
  ];

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
    if (donneesFormulaire.prix <= 0) {
      setErreur('Le prix doit être supérieur à 0');
      setChargement(false);
      return;
    }

    try {
      await annoncesService.creerAnnonce({
        ...donneesFormulaire,
        prix: parseFloat(donneesFormulaire.prix)
      });
      
      alert('Annonce créée avec succès !');
      navigate('/');
      
    } catch (erreur) {
      setErreur(
        erreur.response?.data?.message || 
        'Erreur lors de la création de l\'annonce'
      );
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="creer-annonce">
      <div className="formulaire-container">
        <h2>Créer une nouvelle annonce</h2>
        
        {erreur && (
          <div className="message-erreur">
            {erreur}
          </div>
        )}
        
        <form onSubmit={gererSoumission} className="formulaire-annonce">
          <div className="groupe-champ">
            <label htmlFor="titre">Titre de l'annonce :</label>
            <input
              type="text"
              id="titre"
              name="titre"
              value={donneesFormulaire.titre}
              onChange={gererChangement}
              required
              maxLength="100"
              disabled={chargement}
            />
          </div>
          
          <div className="groupe-champ">
            <label htmlFor="description">Description :</label>
            <textarea
              id="description"
              name="description"
              value={donneesFormulaire.description}
              onChange={gererChangement}
              required
              maxLength="1000"
              rows="5"
              disabled={chargement}
            />
          </div>
          
          <div className="groupe-champ">
            <label htmlFor="prix">Prix (€) :</label>
            <input
              type="number"
              id="prix"
              name="prix"
              value={donneesFormulaire.prix}
              onChange={gererChangement}
              required
              min="0"
              step="0.01"
              disabled={chargement}
            />
          </div>
          
          <div className="groupe-champ">
            <label htmlFor="categorie">Catégorie :</label>
            <select
              id="categorie"
              name="categorie"
              value={donneesFormulaire.categorie}
              onChange={gererChangement}
              required
              disabled={chargement}
            >
              {categories.map(categorie => (
                <option key={categorie} value={categorie}>
                  {categorie}
                </option>
              ))}
            </select>
          </div>
          
          <div className="boutons-action">
            <button 
              type="button" 
              onClick={() => navigate('/')}
              className="btn-secondaire"
              disabled={chargement}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="btn-principal"
              disabled={chargement}
            >
              {chargement ? 'Création...' : 'Créer l\'annonce'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreerAnnonce;