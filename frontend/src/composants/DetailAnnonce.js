import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { annoncesService } from '../services/api';

const DetailAnnonce = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [annonce, setAnnonce] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const chargerAnnonce = async () => {
      try {
        const reponse = await annoncesService.obtenirAnnonce(id);
        setAnnonce(reponse.data);
      } catch (erreur) {
        setErreur('Annonce non trouvée');
        console.error('Erreur:', erreur);
      } finally {
        setChargement(false);
      }
    };

    chargerAnnonce();
  }, [id]);

  const supprimerAnnonce = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      try {
        await annoncesService.supprimerAnnonce(id);
        alert('Annonce supprimée avec succès');
        navigate('/');
      } catch (erreur) {
        alert('Erreur lors de la suppression');
        console.error('Erreur:', erreur);
      }
    }
  };

  if (chargement) {
    return <div className="chargement">Chargement de l'annonce...</div>;
  }

  if (erreur) {
    return (
      <div className="erreur-page">
        <h2>Erreur</h2>
        <p>{erreur}</p>
        <button onClick={() => navigate('/')} className="btn-principal">
          Retour aux annonces
        </button>
      </div>
    );
  }

  return (
    <div className="detail-annonce">
      <div className="annonce-container">
        <div className="en-tete-detail">
          <button onClick={() => navigate('/')} className="btn-retour">
            ← Retour aux annonces
          </button>
        </div>
        
        <div className="contenu-annonce">
          <h1>{annonce.titre}</h1>
          
          <div className="meta-annonce">
            <span className="prix-detail">{annonce.prix} €</span>
            <span className="categorie-detail">📂 {annonce.categorie}</span>
          </div>
          
          <div className="informations-auteur">
            <h3>Publié par :</h3>
            <p>👤 {annonce.auteur?.nomUtilisateur}</p>
            <p>📧 {annonce.auteur?.email}</p>
            <p>📅 {new Date(annonce.createdAt).toLocaleDateString('fr-FR')}</p>
          </div>
          
          <div className="description-complete">
            <h3>Description :</h3>
            <p>{annonce.description}</p>
          </div>
          
          <div className="actions-detail">
            <button 
              onClick={supprimerAnnonce}
              className="btn-supprimer-detail"
            >
              Supprimer cette annonce
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailAnnonce;