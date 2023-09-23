## Documentation du Serveur: Configuration et Fonctionnalités

### 1. **Environnement et Variables d'Environnement**

- **Description** : 
  L'application détermine si elle est en mode de production ou de développement. En mode de développement, les variables d'environnement sont chargées depuis un fichier pour faciliter les tests et le développement.

### 2. **Middleware et Initialisation**

- **Description** :
  Plusieurs outils et middleware sont mis en place pour renforcer la sécurité, faciliter la gestion des requêtes, et gérer l'authentification.

### 3. **Sécurité des En-têtes HTTP avec Helmet**

- **Description** : 
  L'utilisation de `helmet` permet de sécuriser l'application en définissant des en-têtes HTTP appropriés, protégeant ainsi contre plusieurs vulnérabilités courantes.

### 4. **Limitation du Taux de Requêtes**

- **Description** : 
  Une limitation est mise en place pour prévenir les abus, en limitant chaque adresse IP à un certain nombre de requêtes en un temps donné.

### 5. **CORS - Contrôle d'Accès HTTP**

- **Description** : 
  Le middleware CORS est utilisé pour gérer les requêtes provenant de domaines différents, permettant ou bloquant l'accès selon les besoins.

### 6. **Authentification avec Google**

- **Description** : 
  Grâce à `passport`, une stratégie d'authentification Google est mise en œuvre. Cela permet aux utilisateurs de se connecter en utilisant leur compte Google, offrant ainsi une méthode d'authentification rapide et sécurisée.

### 7. **Réinitialisation du Mot de Passe**

- **Description** : 
  Une fonctionnalité est mise en place pour permettre aux utilisateurs de réinitialiser leur mot de passe. Dans la phase actuelle, un mail temporaire est envoyé via Gmail. À l'avenir, l'intention est de passer à SendBird pour une solution de production.

### 8. **Système de Routage**

- **Description** : 
  Le serveur utilise un système de routage pour diriger les requêtes vers les bons endpoints. Actuellement, un système de routage pour l'authentification est mis en place via `/auth`.

### En Conclusion

Cette configuration de serveur est conçue pour être robuste, sécurisée et évolutive. L'ajout de fonctionnalités d'authentification et de réinitialisation de mot de passe renforce la convivialité pour les utilisateurs finaux tout en maintenant un niveau élevé de sécurité.
