import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './composants/Navigation';
import Connexion from './composants/Connexion';
import Inscription from './composants/Inscription';
import ListeAnnonces from './composants/ListeAnnonces';
import CreerAnnonce from './composants/CreerAnnonce';
import DetailAnnonce from './composants/DetailAnnonce';
import './App.css';

function App() {
  const [utilisateurConnecte, setUtilisateurConnecte] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    // Vérifier si un utilisateur est déjà connecté
    const token = localStorage.getItem('token');
    const utilisateur = localStorage.getItem('utilisateur');
    
    if (token && utilisateur) {
      setUtilisateurConnecte(JSON.parse(utilisateur));
    }
    setChargement(false);
  }, []);

  const gererConnexion = (token, utilisateur) => {
    localStorage.setItem('token', token);
    localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
    setUtilisateurConnecte(utilisateur);
  };

  const gererDeconnexion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('utilisateur');
    setUtilisateurConnecte(null);
  };

  if (chargement) {
    return <div className="chargement">Chargement...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Navigation 
          utilisateurConnecte={utilisateurConnecte} 
          onDeconnexion={gererDeconnexion} 
        />
        
        <main className="contenu-principal">
          <Routes>
            <Route path="/" element={<ListeAnnonces />} />
            <Route path="/annonce/:id" element={<DetailAnnonce />} />
            
            <Route 
              path="/connexion" 
              element={
                utilisateurConnecte ? 
                <Navigate to="/" /> : 
                <Connexion onConnexion={gererConnexion} />
              } 
            />
            
            <Route 
              path="/inscription" 
              element={
                utilisateurConnecte ? 
                <Navigate to="/" /> : 
                <Inscription onConnexion={gererConnexion} />
              } 
            />
            
            <Route 
              path="/creer-annonce" 
              element={
                utilisateurConnecte ? 
                <CreerAnnonce /> : 
                <Navigate to="/connexion" />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;