import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Configuration d'axios
const api = axios.create({
  baseURL: API_URL,
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Services d'authentification
export const authentificationService = {
  inscription: (donneesUtilisateur) => api.post('/auth/inscription', donneesUtilisateur),
  connexion: (donneesConnexion) => api.post('/auth/connexion', donneesConnexion),
};

// Services des annonces
export const annoncesService = {
  obtenirToutesAnnonces: (categorie) => api.get(`/annonces${categorie ? `?categorie=${categorie}` : ''}`),
  obtenirAnnonce: (id) => api.get(`/annonces/${id}`),
  creerAnnonce: (donneesAnnonce) => api.post('/annonces', donneesAnnonce),
  supprimerAnnonce: (id) => api.delete(`/annonces/${id}`),
};

export default api;