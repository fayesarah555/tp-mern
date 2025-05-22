# Application MERN "Le Bon Coin"

> Application de petites annonces développée avec la stack MERN (MongoDB, Express.js, React, Node.js).
## Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Lancement](#lancement)
- [Structure du projet](#structure-du-projet)
- [API Endpoints](#api-endpoints)
- [Sécurité](#sécurité)
- [Auteur](#auteur)

## Aperçu

Cette application reproduit les fonctionnalités principales de **Le Bon Coin** :
- Système d'authentification sécurisé (inscription/connexion)
- Gestion complète des annonces (CRUD)
- Filtrage par catégories
- Interface responsive et moderne
- Récupération automatique de l'ID utilisateur via JWT

## Fonctionnalités

### Authentification
- **Inscription** avec validation des données
- **Connexion** sécurisée avec JWT
- **Hachage des mots de passe** avec bcrypt
- **Protection des routes** sensibles

### Gestion des annonces
- **Création d'annonces** (titre, description, prix, catégorie)
- **Affichage de toutes les annonces** avec pagination
- **Filtrage par catégorie** (Immobilier, Véhicules, Électronique, etc.)
- **Page de détail** pour chaque annonce
- **Suppression d'annonces**
- **Association automatique** de l'auteur via le token JWT

### Interface utilisateur
- **Design responsive** adapté mobile/tablette/desktop
- **Navigation intuitive** avec React Router
- **Gestion d'état locale** avec useState/useEffect
- **Messages d'erreur** et de validation

## Technologies utilisées

### Backend
- **Node.js** - Environnement d'exécution JavaScript
- **Express.js** - Framework web pour Node.js
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM (Object Document Mapper) pour MongoDB
- **JWT** (jsonwebtoken) - Authentification par tokens
- **bcryptjs** - Hachage sécurisé des mots de passe
- **CORS** - Gestion des requêtes cross-origin
- **dotenv** - Gestion des variables d'environnement

### Frontend
- **React** (v19.1.0) - Bibliothèque UI
- **React Router DOM** - Navigation côté client
- **Axios** - Client HTTP pour les appels API
- **CSS3** - Styles avec variables CSS
- **localStorage** - Stockage local des tokens

## Prérequis

Avant d'installer l'application, assurez-vous d'avoir :

- **Node.js** (version 14 ou supérieure)
- **MongoDB** (local ou MongoDB Atlas)
- **npm** ou **yarn** (inclus avec Node.js)

## Installation

### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/leboncoin-mern.git
cd leboncoin-mern
```

### 2. Installation des dépendances Backend
```bash
cd backend
npm install
```

### 3. Installation des dépendances Frontend
```bash
cd ../frontend
npm install
```

## Configuration

### Variables d'environnement Backend

Créer un fichier `.env` dans le dossier `backend/` :

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/leboncoin
JWT_SECRET=votre_secret_jwt_super_securise_changez_moi
```

**Important :** Changez le `JWT_SECRET` par une chaîne aléatoire sécurisée

### Démarrage de MongoDB

**MongoDB local :**
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb/brew/mongodb-community

# Linux
sudo systemctl start mongod
```

## Lancement

### Mode développement

**1. Démarrer le backend :**
```bash
cd backend
npm run dev
```
Serveur accessible sur : http://localhost:5000

**2. Démarrer le frontend (nouveau terminal) :**
```bash
cd frontend
npm start
```
Application accessible sur : http://localhost:3000

## Structure du projet

```
leboncoin-mern/
├── backend/
│   ├── config/
│   │   └── baseDeDonnees.js
│   ├── middleware/
│   │   └── authentification.js
│   ├── models/
│   │   ├── Utilisateur.js
│   │   └── Annonce.js
│   ├── routes/
│   │   ├── authentification.js
│   │   └── annonces.js
│   ├── .env
│   ├── package.json
│   └── serveur.js
├── frontend/
│   ├── src/
│   │   ├── composants/
│   │   │   ├── Navigation.js
│   │   │   ├── Connexion.js
│   │   │   ├── Inscription.js
│   │   │   ├── ListeAnnonces.js
│   │   │   ├── CreerAnnonce.js
│   │   │   └── DetailAnnonce.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
| Méthode | Endpoint | Description | Auth requise |
|---------|----------|-------------|--------------|
| POST | `/api/auth/inscription` | Créer un compte | Non |
| POST | `/api/auth/connexion` | Se connecter | Non |

### Annonces
| Méthode | Endpoint | Description | Auth requise |
|---------|----------|-------------|--------------|
| GET | `/api/annonces` | Récupérer toutes les annonces | Non |
| GET | `/api/annonces?categorie=Électronique` | Filtrer par catégorie | Non |
| GET | `/api/annonces/:id` | Récupérer une annonce | Non |
| POST | `/api/annonces` | Créer une annonce | Oui |
| DELETE | `/api/annonces/:id` | Supprimer une annonce | Oui |

### Exemples de requêtes

**Inscription :**
```json
POST /api/auth/inscription
{
  "nomUtilisateur": "johndoe",
  "email": "john@example.com",
  "motDePasse": "motdepasse123"
}
```

**Création d'annonce :**
```json
POST /api/annonces
Authorization: Bearer <token>
{
  "titre": "iPhone 13 Pro",
  "description": "iPhone en excellent état, peu utilisé",
  "prix": 800,
  "categorie": "Électronique"
}
```

## Sécurité

### Mesures de sécurité implémentées

- **Hachage des mots de passe** avec bcrypt et salt automatique
- **Authentification JWT** avec expiration (7 jours)
- **Middleware de vérification** des tokens
- **Variables d'environnement** pour les secrets
- **Validation des données** côté serveur et client
- **Protection CORS** configurée
- **Routes protégées** pour les actions sensibles
- **Récupération automatique** de l'ID utilisateur via JWT

### Fonctionnalités de sécurité

**Backend :**
- Les mots de passe ne sont jamais stockés en clair
- Vérification de l'unicité des emails/noms d'utilisateur
- Validation Mongoose avec messages d'erreur
- Association automatique auteur ↔ annonce via token JWT

**Frontend :**
- Token stocké en localStorage avec envoi automatique
- Redirection automatique si non connecté
- Nettoyage du token à la déconnexion
- Validation côté client avant envoi

## Fonctionnalités testées

### Tests d'intégration réalisés

**Inscription/Connexion**
- Création de compte avec données valides
- Gestion des erreurs (email déjà utilisé, etc.)
- Connexion avec identifiants corrects/incorrects

**Gestion des annonces**
- Création d'annonce avec utilisateur connecté
- Vérification de l'auteur automatique via JWT
- Filtrage par catégorie fonctionnel
- Affichage des détails complets

**Sécurité**
- Accès refusé aux pages protégées sans token
- Token inclus automatiquement dans les requêtes
- Hachage effectif des mots de passe en BDD

**Interface utilisateur**
- Navigation fluide entre les pages
- Responsive design sur mobile/tablette
- Messages de feedback utilisateur

## Auteur

**Sarah Faye**
- École : IPSSI - Master IA
- Projet : TP Individuel MERN
- Année : 2025

## Notes de développement

### Choix techniques


**Architecture :** 
- Séparation claire backend/frontend
- Services API centralisés
- Composants React réutilisables
- States locaux uniquement

**Contraintes respectées :**
- ID auteur récupéré automatiquement via JWT
- CRUD complet sur les annonces
- Filtrage par catégorie
- Pages de détail avec informations auteur
- Authentification sécurisée JWT + bcrypt

---
