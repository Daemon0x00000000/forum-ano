# Forum Anonyme

Un système simple de forum anonyme permettant aux utilisateurs de publier et de consulter des messages.

## Description

Ce projet est une application web de forum anonyme composée de trois services principaux :
- **API** : Gère les opérations de base de données et expose des endpoints RESTful
- **Thread** : Affiche les messages existants
- **Sender** : Permet aux utilisateurs de créer de nouveaux messages

L'application est conçue avec une architecture microservices, où chaque composant a une responsabilité spécifique.

## Technologies utilisées

- Node.js
- Express.js
- MongoDB
- Docker
- EJS (pour les templates)
- Axios (pour les requêtes HTTP entre services)

## Architecture

L'application est structurée comme suit :
- **API** : Fournit des endpoints RESTful pour la gestion des messages
- **Base de données MongoDB** : Stocke les messages
- **Thread** : Service frontend pour afficher les messages (port 81)
- **Sender** : Service frontend pour envoyer des messages (port 8090)

## Installation et démarrage

### Prérequis
- Docker et Docker Compose

### Lancement
1. Clonez ce dépôt
2. Naviguez dans le dossier du projet
3. Lancez l'application avec Docker Compose :
```
docker-compose up -d
```

## Utilisation

Une fois l'application lancée : http://localhost:81

## Structure du projet

```
services/
├── api/              # Service API REST
│   ├── server.js
│   └── Dockerfile
├── thread/           # Service d'affichage des messages
│   ├── server.js
│   ├── views/
│   └── Dockerfile
└── sender/           # Service d'envoi de messages
    ├── server.js
    ├── views/
    └── Dockerfile
docker-compose.yml
```

## Fonctionnalités

- Publication de messages anonymes avec pseudonyme
- Visualisation des messages existants
- Interface utilisateur simple et réactive

## Contribution

Ce projet a été développé dans le cadre d'un cours. Les contributions ne sont pas recherchées actuellement.

## Licence

Tous droits réservés - 2025 Forum Anonyme