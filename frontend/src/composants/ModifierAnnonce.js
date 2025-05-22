
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { annoncesService } from '../services/api';

const ModifierAnnonce = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donneesFormulaire, setDonneesFormulaire] = useState({
    titre: '',
    description: '',
    prix: '',
    categorie: 'Électronique'
  });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const [chargementInitial, setChargementInitial] = useState(true);

  const categories = [
    'Immobilier', 'Véhicules', 'Électronique', 
    'Maison', 'Vêtements', 'Loisirs', 'Autres'
  ];

  // Charger les données de l'annonce existante
  useEffect(() => {
    const chargerAnnonce = async () => {
      try {
        const reponse = await annoncesService.obtenirAnnonce(id);
        const annonce = reponse.data;
        
        setDonneesFormulaire({
          titre: annonce.titre,
          description: annonce.description,
          prix: annonce.prix.toString(),
          categorie: annonce.categorie
        });
      } catch (erreur) {
        setErreur('Erreur lors du chargement de l\'annonce');
        console.error('Erreur:', erreur);
      } finally {
        setChargementInitial(false);
      }
    };

    chargerAnnonce();
  }, [id]);

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
      await annoncesService.modifierAnnonce(id, {
        ...donneesFormulaire,
        prix: parseFloat(donneesFormulaire.prix)
      });
      
      alert('Annonce modifiée avec succès !');
      navigate(`/annonce/${id}`);
      
    } catch (erreur) {
      if (erreur.response?.status === 403) {
        setErreur('Vous ne pouvez modifier que vos propres annonces');
      } else {
        setErreur(
          erreur.response?.data?.message || 
          'Erreur lors de la modification de l\'annonce'
        );
      }
    } finally {
      setChargement(false);
    }
  };

  if (chargementInitial) {
    return <div className="chargement">Chargement de l'annonce...</div>;
  }

  return (
    <div className="creer-annonce">
      <div className="formulaire-container">
        <h2>Modifier l'annonce</h2>
        
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
              onClick={() => navigate(`/annonce/${id}`)}
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
              {chargement ? 'Modification...' : 'Modifier l\'annonce'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifierAnnonce;
