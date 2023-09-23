## Documentation : Améliorations de sécurité du serveur


Afin d'assurer une expérience optimale et sécurisée pour nos utilisateurs, nous avons intégré plusieurs améliorations et fonctionnalités de sécurité à notre application. Voici une description de ces ajouts et les raisons de leur mise en œuvre.

### 1. **Helmet** : Sécurisation des en-têtes HTTP

- **Quoi** : Helmet est un module qui aide à protéger l'application en définissant divers en-têtes HTTP. Par exemple, il masque la version de Node.js utilisée, ce qui rend les attaques ciblées plus difficiles.
  
- **Pourquoi** : De nombreux types d'attaques exploitent des vulnérabilités à partir des en-têtes HTTP. En sécurisant ces en-têtes, nous réduisons les risques d'expositions à de telles attaques.

### 2. **Limitation du taux de requêtes (Rate Limiting)**

- **Quoi** : Nous avons mis en place une limitation qui restreint chaque adresse IP à 100 requêtes toutes les 15 minutes.
  
- **Pourquoi** : Cela empêche les attaques par force brute qui visent à inonder notre serveur de requêtes dans le but de le surcharger ou de deviner un mot de passe.

### 3. **CORS (Cross-Origin Resource Sharing)**

- **Quoi** : CORS est un mécanisme qui permet aux ressources d'un site web d'être demandées depuis un autre domaine. Nous avons restreint l'accès à notre API à des domaines spécifiques pour assurer une meilleure sécurité.
  
- **Pourquoi** : Cela empêche d'éventuelles demandes malveillantes provenant de sites tiers inconnus, tout en permettant aux domaines de confiance d'accéder à nos ressources.

### 4. **Initialisation et Configuration de Passport**

- **Quoi** : Passport est un middleware d'authentification pour Node.js, et nous l'utilisons pour gérer les connexions et les sessions des utilisateurs.
  
- **Pourquoi** : Une bonne gestion de l'authentification est essentielle pour garantir que seuls les utilisateurs autorisés accèdent à certaines parties de notre application.

### 5. **Mise en place d'un gestionnaire d'erreurs**

- **Quoi** : Nous avons un middleware qui intercepte les erreurs générées dans notre application pour donner une réponse appropriée à l'utilisateur.
  
- **Pourquoi** : Cela permet une meilleure expérience utilisateur en fournissant des messages d'erreur clairs et en évitant d'exposer des détails techniques qui pourraient être exploités.

---
