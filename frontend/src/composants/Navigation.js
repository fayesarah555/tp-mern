import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = ({ utilisateurConnecte, onDeconnexion }) => {
  const navigate = useNavigate();

  const gererDeconnexion = () => {
    onDeconnexion();
    navigate('/');
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="logo">
          🏪 Le Bon Coin
        </Link>
        
        <div className="nav-liens">
          <Link to="/" className="nav-lien">
            Annonces
          </Link>
          
          {utilisateurConnecte ? (
            <>
              <Link to="/creer-annonce" className="nav-lien">
                Créer une annonce
              </Link>
              <div className="utilisateur-info">
                <span>Bonjour, {utilisateurConnecte.nomUtilisateur}</span>
                <button onClick={gererDeconnexion} className="btn-deconnexion">
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <div className="auth-liens">
              <Link to="/connexion" className="nav-lien">
                Connexion
              </Link>
              <Link to="/inscription" className="nav-lien">
                Inscription
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
