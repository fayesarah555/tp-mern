import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { annoncesService } from '../services/api';

const ListeAnnonces = () => {
  const [annonces, setAnnonces] = useState([]);
  const [categorieSelectionnee, setCategorieSelectionnee] = useState('Toutes');
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  const categories = [
    'Toutes', 'Immobilier', 'Véhicules', 'Électronique', 
    'Maison', 'Vêtements', 'Loisirs', 'Autres'
  ];

  const chargerAnnonces = async (categorie = 'Toutes') => {
    try {
      setChargement(true);
      const reponse = await annoncesService.obtenirToutesAnnonces(categorie);
      setAnnonces(reponse.data);
      setErreur('');
    } catch (erreur) {
      setErreur('Erreur lors du chargement des annonces');
      console.error('Erreur:', erreur);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerAnnonces(categorieSelectionnee);
  }, [categorieSelectionnee]);

  const gererChangementCategorie = (e) => {
    setCategorieSelectionnee(e.target.value);
  };

  const supprimerAnnonce = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      try {
        await annoncesService.supprimerAnnonce(id);
        // Recharger les annonces après suppression
        chargerAnnonces(categorieSelectionnee);
        alert('Annonce supprimée avec succès');
      } catch (erreur) {
        alert('Erreur lors de la suppression de l\'annonce');
        console.error('Erreur:', erreur);
      }
    }
  };

  if (chargement) {
    return <div className="chargement">Chargement des annonces...</div>;
  }

  return (
    <div className="liste-annonces">
      <div className="en-tete-annonces">
        <h1>Toutes les annonces</h1>
        
        <div className="filtres">
          <label htmlFor="categorie">Filtrer par catégorie :</label>
          <select 
            id="categorie"
            value={categorieSelectionnee} 
            onChange={gererChangementCategorie}
            className="selecteur-categorie"
          >
            {categories.map(categorie => (
              <option key={categorie} value={categorie}>
                {categorie}
              </option>
            ))}
          </select>
        </div>
      </div>

      {erreur && (
        <div className="message-erreur">
          {erreur}
        </div>
      )}

      <div className="grille-annonces">
        {annonces.length === 0 ? (
          <p className="aucune-annonce">Aucune annonce trouvée dans cette catégorie.</p>
        ) : (
          annonces.map((annonce) => (
            <div key={annonce._id} className="carte-annonce">
              <h3>{annonce.titre}</h3>
              <p className="prix">{annonce.prix} €</p>
              <p className="categorie">📂 {annonce.categorie}</p>
              <p className="auteur">👤 Par {annonce.auteur?.nomUtilisateur}</p>
              <p className="description">
                {annonce.description.length > 100 
                  ? `${annonce.description.substring(0, 100)}...` 
                  : annonce.description
                }
              </p>
              
              <div className="actions-annonce">
                <Link 
                  to={`/annonce/${annonce._id}`} 
                  className="btn-voir-details"
                >
                  Voir les détails
                </Link>
                <button 
                  onClick={() => supprimerAnnonce(annonce._id)}
                  className="btn-supprimer"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListeAnnonces;
