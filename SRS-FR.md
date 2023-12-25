# Cahier des Charges

### 1. Introduction :
   - **Objectif du Document :**
     - Ce document définit les exigences logicielles pour le développement d'un jeu Pong multijoueur. Le projet sera dirigé par Mouad Bouthaich, avec l'objectif d'un développement rapide dans un délai de trois semaines.

   - **Contexte du Projet :**
     - L'objectif est de créer un jeu Pong multijoueur fonctionnel en utilisant Angular pour le frontend et NestJS pour le backend, avec des mises à jour en temps réel facilitées par WebSockets.

   - **Parties prenantes et leurs rôles :**
     - Équipe du Projet :
       - Chef de Projet/Développeur/Concepteur UI-UX/Tester : Mouad Bouthaich
     - Client : Mouad Bouthaich
     - Utilisateurs Finaux : Joueurs

### 2. Présentation du Projet :
   - **Description :**
     - Le jeu Pong multijoueur offrira une expérience de jeu captivante axée sur l'interaction en temps réel. Angular et NestJS seront utilisés respectivement pour le développement frontend et backend, avec WebSockets assurant des mises à jour en temps réel fluides.

   - **Buts et objectifs  :**
     - Développer un produit minimal viable (MVP) avec des fonctionnalités essentielles.
     - Mettre en place un système d'authentification et d'autorisation utilisateur sécurisé.
     - Fournir un jeu Pong multijoueur de base avec des mises à jour en temps réel.
     - Assurer un gameplay fluide avec une latence minimale.

### 3. Contexte :
   - **Environnement :**
     - L'application sera conteneurisée à l'aide de Docker et Docker Compose.
     - Les mises à jour en temps réel seront facilitées par WebSockets.

   - **Contraintes et Dépendances :**
     - Respect des meilleures pratiques de sécurité.
     - Dépendance à WebSockets pour la fonctionnalité en temps réel.

### 4. Exigences Fonctionnelles :
   - **Enregistrement et Authentification de l'Utilisateur :**
     - Système d'enregistrement et d'authentification utilisateur sécurisé.

   - **Fonctionnalités du Gameplay :**
     - Fonctionnalité multijoueur avec mises à jour en temps réel.
     - Contrôles réactifs pour l'interaction des joueurs.

   - **Scalabilité :**
     - Conception pour la scalabilité afin d'accommoder des améliorations futures potentielles.

### 5. Exigences Non-fonctionnelles :
   - **Performance :**
     - Gameplay fluide avec une latence minimale.
     - Scalabilité pour accueillir une base de joueurs croissante.

   - **Sécurité :**
     - Mise en œuvre de mesures d'authentification sécurisée.

### 6. Portée du Projet :
   - **Inclus :**
     - Jeu Pong multijoueur avec mises à jour en temps réel, authentification utilisateur.

   - **Exclus :**
     - Fonctionnalités avancées au-delà du gameplay de base.

### 7. Contraintes :
   - **Temps :**
     - Achèvement du projet en 3 semaines.

   - **Budget :**
     - Budget total : 0 DH.

   - **Ressources :**
     - Équipe de développement : 1 personne (Mouad Bouthaich).
     - Équipement : Ordinateurs personnels.

### 8. Critères d'Acceptation :
   - **Conditions de Réussite :**
     - Les joueurs peuvent s'enregistrer et s'authentifier en toute sécurité.
     - Le jeu Pong multijoueur avec mises à jour en temps réel est fonctionnel.
     - Contrôles réactifs pour l'interaction des joueurs.

### 9. Livrables :
   - **Résultats Attendus :**
     - Jeu Pong multijoueur fonctionnel.
     - Documentation de base pour les développeurs.

### 10. Calendrier :
   - **Chronologie du Projet :**
     - Semaine 1 : Planification et Configuration
     - Semaine 2 : Développement Frontend et Backend
     - Semaine 3 : Tests et Optimisation

### 11. Communication :
   - **Méthodes :**
     - Stand-ups semi-quotidiens.
     - Réunions au besoin.
     - Communication immédiate pour les problèmes critiques.

   - **Fréquence :**
     - Stand-ups tous les deux jours.

### 12. Gestion des Risques :
   - **Risques Identifiés :**
     - **Contraintes en Ressources :**
       - *Atténuation : Allocation efficace des tâches et communication claire.*
       - *Contingence : Ajustements du calendrier du projet si nécessaire.*
     - **Défis Techniques :**
       - *Atténuation : Prototypage et identification précoce des défis.*
       - *Contingence : Résolution rapide des problèmes et ajustements agiles.*

   - **Stratégies d'Atténuation :**
     - Définition claire des rôles et responsabilités.
     - Communication continue pour identifier tôt les défis.
     - Prototypage régulier et tests pour détecter tôt les problèmes.
     - Approche de développement agile pour des ajustements rapides.