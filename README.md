# MeowCitizen Engagement App dans le cadre du cours AppMob 2017 - HEIG

![Image of BTC](http://i.imgur.com/ZZo5Bh1.png)

Ceci est une application permettant à tous les citoyens d'aider à sauver les chats bloqués dans les arbes, blessés ou perdus.

Avec cette application disponible sur IOS et Android gratuitement,

*Vous pourrez*:
* Créer un compte
* Voir sur la carte tous les pauvres chats qui nécessitent de l'aide
* Avoir la liste complète des problèmes et les trier selon vos critères de recherche
* Avoir accès aux détails d'un problème afin de connaître son état, sa date de création, etc..
* Reporter un problème que vous avez vu
* Commenter un problème

## Pour vous enregistrer

C'est très facile! Nous avons simplement besoin d'un nom d'utilisateur, de votre nom et prénom ainsi que d'un mot de passe que vous pourrez choisir à votre guise. Ceci est totalement optionel, mais si vous désirez être contacter en cas de besoin, vous pourrez également fournir votre numéro de téléphone qui sera stocker de manière totalement confidentielle.

![Imgur](http://i.imgur.com/u43DCxx.png)

### Pour vous log

Il vous suffira de rentrer votre nom d'utilisateur et votre mot de passe personnel. Afin de rendre votre expérience plus agréable, notre application se souviendra de vous et ne vous redemandera pas de vous logger tant que vous ne vous delogger pas manuellement!

![Imgur](http://i.imgur.com/2raXsoD.png)

### Une fois log

Vous aurez accès à la map avec un curseur indiquant votre posisition (il vous faut activer la géolocalisation sur votre smartphone) ainsi qu'aux problèmes proches de vous symbolisés par des icones de chat.

![Imgur](http://i.imgur.com/ah1n2Pj.png)

### Menu déroulant

En cliquant sur l'icone de menu en haut à gauche, vous accéderez au menu de l'application. Depuis ce menu,
*Vous accéderez*:
* A votre profil personnel
* A la liste des problèmes
* A nos conditions d'utilisations
* Au bouton permettant de vous deloggez

![Imgur](http://i.imgur.com/U41MUQs.png)

### Nouveau problème

Cette page vous permettra de poster un nouveau problème qui sera automatiquement géolocalisé en utilisant les données fournies par votre smartphone.
En créant un nouveau problème, vous aurez la possibilité de choisir un type, de décrire le problème et de prendre une photo afin de mieux illustrer la situation.

![Imgur](http://i.imgur.com/6WAnLUz.png)

 ### Liste des problèmes

Vous trouverez ici la liste complète des problèmes stockées dans notre base de données. Vous aurez également la possibilité de trier les problèmes à l'aide d'une barre de recherche.

![Imgur](http://i.imgur.com/0Yi147K.png)

 ### Détails d'un problème - Vue Citizen 

En cliquant sur la flèche noir à droite d'un problème, vous accéderez aux détails de ce problème. Sur cette page, vous pourrez également poster des commentaires.
Les utilisateurs ayant le rôle de staff auront la possibilité d'éditer les détails des problèmes et de créer des nouveaux types afin de mieux classer les problèmes.

![Imgur](http://i.imgur.com/VJcUIGv.png)

 ### Détails d'un problème - Vue Staff

En étant connecté comme staff, vous aurez la possibilité d'avoir accès à des options complémentaires sur a page Issue Details. Ces options vous permettrons de:

* Changer l'état d'un problème
* Crée un nouveau type de problème
* Supprimer un type de problème

![Imgur](http://i.imgur.com/JjP3XCW.png)

### Implémentations futures 

- La possibilité de choisir son emplacement sur la carte quand on poste un problème.
- Filtrer les problèmes sur un rayon de X autour de la personne selon ses envies.
- Afficher la liste des problèmes d'un utilisateur sur son profil personnel.
- Donner la possibilité de changer le nom d'utilisateur et le mot de passe à un utilisateur via l'icone d'édition sur la page Myprofile.
- Rajouter une page avec les conditions générales d'utilisation.
- Optimiser la fonction d'afficher des commentaires. Cliquer pour devoir les voir n'est pas optimisé.

### Notes Back-end

Cette partie contient les informations générales concernant les controllers dans le dossier js. Les services et fonctions de base ajoutées lors de la théorie au début du projet ne sont pas expliqués. 

Ça se peut qu'il faille recharger les pages pour certaines opérations (ajout de commentaire et voir celui-ci directement, changement d'état d'une issue et voir celle-ci directement et ajout d'une issueType et voir celui-ci directement)

auth.js :  Ce controller contient les différents fonctions et services permettant à un utilisateur de se logger ou de s'enregistrer.  Le controller LoginCtrl contient : - Une fonction de login qui permet à l'utilisateur de se logguer et de fixer des cookies(roles et nom d'utilisateur) afin de garder les infos de l'utilisateur à travers les différentes actions et views de l'application. Ces cookies sont supprimés lorsque l'utilisateur se déloggue.

- Une fonction register qui permet aux utilisateurs de se créer un compte

Le controller LogoutCtrl contient : - Une fonction qui permet à l'utilisateur de se délogguer et de supprimer les cookies créés lors du login.

Les controller AnyCtrl et AuthInterceptor permettent de gérer le token d'identification de l'user.

issues.js :  Ce controller contient les différentes fonctions permettant la gestion des issues.

Le controller allIssuesCtrl permet de gérer l'affichage de toutes les issues dans la partie Issue List de l'application, elle nous affiche toutes les issues et la gestion de la pagination avec la fonction loadMore.

Le controller issueCtrl permet de gérer les différentes opérations liée à une issue précise, c’est-à-dire les détails d'une issue. De base, il affiche les détails de l'issue sélectionnée.   Ce controller contient :  - Une fonction seeComments qui permet de voir les commentaires de l'issue en question avec une gestion de la pagination.

- Une fonction postComments qui permet de poster un commentaire pour cette issue précise.

- Un fonction manageIssues qui permet aux utilisateurs "staff" de changer l'état d'une issue.

- Une fonction addIssueType qui permet aux utilisateurs "staff" d'ajouter un type d'issue.

- Une fonction deleteIssueType qui permet aux utilisateurs "staff" de supprimer une type d'issue.

Le controller newIssueCtrl permet de gérer l'ajout d'une nouvelle issue. Cet ajout se fait depuis la page "Home" de l'application.

Le controller MapCtrl permet de gérer la géolocalisation et l'affichage des issues sur la carte.  A améliorer ;
 La séparation plus précise des différents controllers :
- Avoir un fichier user,js pour y mettre la fonction de "register".
- De mettre tout ce qui concerne les commentaires dans un fichier comments.js.
- Tout ce qui gère les les types d'issues, dans un fichiers issueTypes.js.
- Un fichier states.js qui contient la fonction de management des états.
- Avoir un fichier newIssues.js pour tout ce qui concerne la création des nouvelles issues.
- Avoir un fichier Map.js qui gère tout ce qui touche à la carte et géoloc.
- Avoir un fichier Camera.js qui gère tout ce qui concerne la caméra. 

La gestion des données de l'utilisateur dans le AuthService et l'exploitation de ce service et non les cookies.

Le rafraîchissement direct pour certaines opérations.

Et plus en général :

La gestion des paramètres de l'utilisateur : - Pouvoir supprimer son compte

- Pouvoir modifier les paramètres de son compte

