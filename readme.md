# Atelier Cluster Redis

## Installation et Configuration du Cluster Redis

#### Choix de l’environnement 

Le parti-pris pour mettre en place le cluster Redis, a été la conteneurisation de celui-ci avec l’utilisation de Docker. Ce choix s’explique par le fait que cette approche offre une gestion plus flexible des ressources, une isolation accrue et facilite le déploiement sur des environnements différents, donc utilisable avec environnements Windows ou bien Linux…

#### Architecture du cluster 

Le cluster Redis composé de trois nœuds maîtres est conçu pour fournir une haute disponibilité, une répartition de charge et une tolérance aux pannes. Chaque nœud maître est responsable d'une partie des données et peut accepter des opérations d'écriture. Les données sont réparties entre les nœuds maîtres en utilisant un algorithme de hachage, assurant ainsi une distribution équilibrée.

#### Comment démarrer le projet avec Docker ?

1. Ouvrir un terminal sur la machine, puis cloner le dépôt grâce à la commande suivante :

``` bash
git clone https://github.com/CRODRGUE/TP2-NoSQL.git
```

2. Se déplacer dans le dossier nommé "TP2-NoSQL", Grâce à la commande :

``` bash
cd TP2-NoSQL/
```
3. Démarrer les services en utilisant docker compose pour effectuer cela, il faut exécuter la commande suivante qui permet de lancer les services en arrière-plan :

``` bash
docker-compose up -d 
```

#### Comment démarrer le Cluster ?

1. Effectuer les étapes de la section "Comment démarrer le projet avec Docker ?"

2. Exécuter la commande suivante qui va permettre d’initialiser et de lancer le cluster :

``` bash
docker-compose exec redis1 redis-cli --cluster create redis1:6379 redis2:6379 redis3:6379 --cluster-replicas 0
```

**N’oubliez pas d’indiquer « yes » suivit d’entre, lors de la question ci-dessous qui va permettre de valider et de lancer le cluster :**

``` bash
Master[0] -> Slots 0 - 5460
Master[1] -> Slots 5461 - 10922
Master[2] -> Slots 10923 - 16383
M: f75145ef51000e4e6db545c2064c39d1b5194434 redis1:6379    
slots:[0-5460] (5461 slots) master
M: 0b02aafc29a4dd8e8defe7de4bca17569b3a03d2 redis2:6379    
slots:[5461-10922] (5462 slots) master
M: 2b5469eaccde1265c9e0230997904d4ecd90bb01 redis3:6379    
slots:[10923-16383] (5461 slots) master
Can I set the above configuration? (type 'yes' to accept): yes
```

3. Vérifier le bon fonctionnement de celui-ci en utilisant la commande ci-dessous dans la CLI redis grâce à la commande ci-dessous :

``` bash
docker-compose exec redis1 redis-cli cluster info
```
Cette commande « CLUSTER INFO »  permet d’obtenir des informations sur le cluster comme le statut, le nombre de nœuds, etc…

Voilà le cluster est maintenant fonctionnel, **bravo !**

## Premiers pas avec le Cluster Redis via la CLI

L'objectif de cette section est de découvrir le SGBD Redis à travers sa CLI ! Pour cela, nous allons voir comment mettre en place un CRUD sur les différents types de données pris en charge nativement par Redis. Dans la première partie, nous aborderons l'insertion, la modification et la suppression de données, puis dans une seconde partie, nous explorerons la manipulation des différentes données avec les subtilités des différents types.

#### Les types pris en charge nativement par Redis

* **Les chaînes de caractères (string)**

Les chaînes de caractères sont l'un des types les plus simples et les plus utilisés avec Redis. Elles permettent de stocker des valeurs individuelles pouvant contenir n'importe quel type de données : des nombres, des données binaires ou bien des chaînes de caractères.

Liste des commandes liées aux chaînes de caractères [ici](https://redis.io/docs/latest/commands/?group=string)

* **Les listes (list)**

Les listes sont des collections de données ordonnées par l'index attribué à chaque membre de la liste.

Liste des commandes liées aux listes [ici](https://redis.io/docs/latest/commands/?group=list)

* **Les ensembles (set)**

Les ensembles sont des collections de données non ordonnées composées de membres uniques. L'avantage d'utiliser des ensembles est d'obtenir des collections avec des membres uniques, ce qui les différencie des listes.

Liste des commandes liées aux ensembles [ici](https://redis.io/docs/latest/commands/?group=set)

* **Les ensembles triés (sorted set)**

Les ensembles triés fonctionnent comme les ensembles classiques, sauf que les membres de l'ensemble sont triés grâce à un score qui leur est attribué (le score est obligatoirement un nombre !).

Liste des commandes liées aux ensembles triés [ici](https://redis.io/docs/latest/commands/?group=sorted-set)

* **Les tables de hachage (hash)**

Les tables de hachage sont des collections de paires champ-valeur. Les champs sont obligatoirement des chaînes de caractères, tandis que pour les valeurs, aucune restriction n'est imposée. Les hachages permettent de stocker des données complexes ou des structures de données.

Liste des commandes liées aux tables de hachage [ici](https://redis.io/docs/latest/commands/?group=hash)

#### Insertion, modification et suppression de données

* **Manipulation de chaines de caractères (string)**

Pour insérer ou bien des modifier des données, il faut utiliser la commande SET ou bien MSET qui permet de modifier ou d'ajouter plusieurs clés en une commande. Ces commandes vérifient l’existence de clé, si elle n’existe pas la clé est créé puis la valeur lui est associée. 


``` js
    // Création d'une clé nommée "key_string" avec sa valeur associée
    SET key_string "Valeur initiale !"
    // key_string = "Valeur initiale !"

    // Modification de la valeur pour la clé "key_string"
    SET key_string "Nouvelle valeur !"
    // key_string = "Nouvelle valeur !"

    // Ajout de deux clés nommées « key_string01 » & « key_string02 » avec leurs valeurs associées
    MSET key_string01 "Valeur key_string01" key_string02 "Valeur key_string02"
    // key_string01="Valeur key_string01" key_string02 "Valeur key_string02"
```
*  **Manipulation de listes (list)**

Pour créer ou bien modifier une liste de données, il faut utiliser la commande LPUSH ou bien RPUSH, qui fonctionnement sur le même principe que SET vérification de l’existence de la clé en cas de clé non existante création de celle-ci.


``` js
    // Ajoute une clé "key_list_name" qui contient la liste de valeurs (les valeurs sont ajoutées au début)
    LPUSH key_list_name "cyril" "enzo" "lino"
    // key_list_name : [lino,enzo,cyril]

    // Ajout d’une clé nommée "key_list_price" avec la liste associée (les valeurs sont ajoutées à la fin)
    RPUSH key_list_price 10 15 24 5
    // key_list_price : [10,15,24,5]

    // Modification du membre à l'index 2 de la liste "key_list_price" 
    LSET key_liste_price 2 150
    // key_list_price : [10,15,150,5]
```

* **Manipulation d'un ensemble (set)**

Pour créer ou bien modifier un ensemble, il faut utiliser la commande SADD. Cette commande permet de créer, mais également d'ajouter de nouveaux membres à un ensemble.

``` js
    // Ajoute d’une clé key_sets_guest_userA avec les valeurs associées à l’ensemble
    SADD key_sets_guest_userA  "cyril" "enzo" "lino" "tristan" "cyril"
    // key_sets_guest_userA : cyril, lino, tristan, enzo

    // Ajoute d’une clé key_sets_guest_userB avec les valeurs associées à l’ensemble
    SADD key_sets_guest_userB "alexandre" "lucas" "hugo" "tristan" 
    // key_sets_guest_userB : lucas, hugo, tristan, alexandre

    // Ajout d'un nouveau membre à l'ensemble key_sets_guest_userB
    SADD key_sets_guest_userB "cyril"
    // key_sets_guest_userB : lucas, hugo, tristan, alexandre, cyril
```

* **Manipulation d'un ensemble trié (sorted set)**

Pour créer ou bien modifier un ensemble trié, il faut utiliser la commande ZADD. Cette commande permet de créer, mais également d'ajouter de nouveaux membres à un ensemble trié. Attention, les ensembles triés fonctionnent avec des pairs scores/membres, le score est obligatoirement un nombre. Le tri va s'effectuer en fonction score.

``` js
    // Ajoute une clé key_sorted_sets_ranking avec les valeurs associer à l’ensemble trié, en fonction du score attribué à la valeur.
    ZADD key_sorted_set_ranking  184 "ben" 123 "hugo" 58 "alice"
    // key_sorted_sets_ranking : alice/58,hugo/123,ben/184

    // Modification du score du membre "alice" qui appartient à l'ensemble "key_sorted_sets_ranking"
    ZADD key_sorted_set_ranking 200 "alice"
    // key_sorted_sets_ranking : alice/200,hugo/123,ben/184
```

* **Manipulation des tables de hachages (hash)**

Pour créer ou bien modifier un hash, il faut utiliser les commandes HSET ou bien HMSET. Le choix de la commande à utiliser va dépendre du nombre de champs que l’on souhaite ajouter, s’il y a plusieurs champs, il faudra obligatoirement utiliser HMSET.

``` js
    // Ajoute une clé key_hash_user avec la paire champ/valeur associée.
    HSET key_hash_user name "cyril"

    // Ajoute d'une clé key_hash_product avec les paires de champ/valeur associées
    HMSET key_hash_product name "ordinateur portable..." description "C'est...." price 1500 stock 5
    
    // Modification d'un champ de la clé "key_hash_product"
    HSET key_hash_product stock 2
```

#### Lescture des données

* **Manipulation de chaines de caractères (string)**

Pour lire des données qui sont associées à une clé qui stocke des chaînes de caractères, il est possible d’utiliser plusieurs commandes : GET, MGET, GETRANG, ou bien encore d’autre commande qui combine des fonctionnalités.

``` js
    // Lecture d'une donnée associée à la clé "key_string"
    GET key_string
    // key_string : "Nouvelle valeur !"

    // Lecture des valeur associées à la liste de clé
    MGET key_string01 key_string02
    //  key_string01 : "Valeur key_string01" key_string02 : "Valeur key_string02

    // Lecture d'une partie de la valeur associée à la clé "key_string" en fonction de l'index de 0 à 5
    GETRANGE key_string 0 5
    // key_string : "Nouvel"
```
* **Manipulation de listes (list)**

Pour récupérer des données qui sont associées à une clé qui stocke des listes, il est possible d’utiliser différentes commandes : LINDEX, LRANGE ou bien d’utiliser des commandes qui combinent plusieurs fonctionnalités.

``` js
    // Récuperation de l'élement à l'index 0 de la clé "key_list_price"
    LINDEX key_list_price 0

    // Récuperation de la totalité des élements de la clé "key_list_name"
    LRANGE key_list_name 0 -1
```

* **Manipulation d'un ensemble (set)**

Pour lire des données qui sont associées à une clé qui stocke un ensemble, il est possible d’utiliser plusieurs commandes : SMEMBERS, SRANDMEMBER, SDIFF, SMISMEMBER, SUNION ou bien ...

``` js
    // Lire la totalité des membres d'un ensemble
    SMEMBERS key_set_guest_userA

    // Obtenir des membres aléatoire d'un ensemble (3 membres aléatoire)
    SRANDMEMBER key_set_guest_userA 3

    // Vérifier la diffrence de membres entre deux ensembles
    SDIFF key_set_guest_userA key_set_guest_userB
    // lino, enzo

    // Unions de deux ensembles
    SUNIONS key_set_guest_userA key_set_guest_userB
    //  cyril, lino, tristan, enzo, lucas, hugo, alexandre
```


* **Manipulation d'un ensemble trié (sorted set)**

Pour récupérer des données qui sont associées à une clé qui stocke des ensembles triés, il est possible d’utiliser la commande : ZRANGE qui remplaces l’utilisation de commandes qui sont combinées dans celle-ci.

``` js
    // Récupération de la totalité des membres de l'ensemble 
    ZRANGE key_sorted_set_ranking 0 -1

    // Récupération des membres avec un score entre 100 et 200 triées dans l'ordre décroissant
    ZRANGE key_sorted_set_ranking 100 200 REV

    // Récupération de la totalité des membres de l'ensemble avec leurs scores
    ZRANGE key_sorted_set_ranking 0 -1 WITHSCORES

```

* **Manipulation des tables de hachages (hash)**

Pour lire des données qui sont associées à une clé qui stocke un hash, il est possible d’utiliser plusieurs commandes : HGET, HMGET, HGETALL, HKEYS ou bien HVALS

``` js
    // Récupération du champ "name" associé à la clé "key_hash_user"
    HGET key_hash_user name

    // Récupération de plusieurs champs associés à la clé "key_hash_product"
    HMGET key_hash_product name price

    // Récupération de la totalité des paires champ/valeur associées à la clé "key_hash_product"
    HGETALL key_hash_product

    // Récupération de la liste des champs associées à la clé "key_hash_product"
    HKEYS key_hash_product

    // Récupération de la liste des valeurs associées à la clé "key_hash_product"
    HVALS key_hash_product
```

## Intégration de Redis dans un projet

Pour démontrer l’utilisation de Redis dans un projet, j’ai pris le parti de l’utiliser pour gérer les sessions. Il répond aux multiples contraintes de cette fonctionnalité qui demande une manipulation des données fréquentes (écriture, lecture, mais également suppression) mais aussi une rapidité de réponse lors de la manipulation de celles-ci. La solution présentée ci-dessous représente uniquement la partie authentification avec la génération de la session, il faudrait rajouter un lien avec une autre base de données utilisant un SGBD différent pour stocker les données de l’application comme par exemple MySQL. 

#### Connexion à l’instance Redis 

Les lignes de code ci-dessous permettent d’initialiser la connexion à une instance Redis avec l’utilisation de NodeJS.

``` Javascript
    // Initialisation de la connexion à l'instance Redis
    const redisClient = redis.createClient({
        host: 'redis1',
        port: 6379
    })
    // Écoute  des événements émis lors de l'initialisation de la connexion
    // Échec de la connexion
    redisClient.on('error', function (err) {
        console.log(`Oupss connexion à Redis impossible : ${err}`);
    });
    // Connexion réussie
    redisClient.on('connect', function () {
        console.log('Connexion à Redis réussie');
    });
```

####  Configuration des sessions

Pour utiliser les sessions, nous utilisons la dépendance ‘express-session’ qui permet une utilisation des sessions de manière à optimiser, mais également sécuriser l'utilisation de celles-ci. Dans les lignes de codes ci-dessous, nous retrouvons la configuration des sessions avec la liaison à l’instance Redis qui permet de stocker celles-ci.

``` Javascript
    // Configuration des sessions avec l'utilisation de Redis pour stocker celles-ci 
    app.use(session({
        store: new RedisStore({ client: redisClient }), // Liaison de Redis pour le stockage
        secret: 'zGf!vkf@75D4',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: false,
            maxAge: 1000 * 60 * 10 // Duré avant l'expiration de celle-ci
        }
    }))
```

####  Authentification de l’utilisateur

Nous retrouvons ci-dessous les lignes de codes qui permettent la connexion, mais également la déconnexion. C’est-à-dire la gestion de la session de l’utilisateur.

``` Javascript
    // Route pour l'authentification et la génération de la session de l'utilisateur
    app.post("/login", (req, res) => {
        // Récupération des données de la requête
        const { username } = req.body
        // Ajout des valeurs en session (username)
        req.session.username = username;
        // Revois d'une réponse avec la session 
        res.end("Connexion validée")
    });

    // Route pour la suppression de la session de l'utilisateur
    app.get("/logout", (req, res) => {
        // Suppression des données stockées en sessions de l'utilisateur
        req.session.destroy(err => {
            if (err) {
                return console.log(err);
            }
            // Redirection vers la page de connexion
            res.redirect("/login")
        });
    });
```

####  Vérification de la session 

Pour vérifier la validité d’une session d’un utilisateur lorsque celui-ci émet une requête sur une route qui demande que l’utilisateur soit authentifié, nous utilisons un middelware qui vérifie la validité de la session pour passer à l’étape suivante pour récupérer les données demandées, sinon il renvoie une erreur 403. Voici le middelware :

``` Javascript
   // Déclaration du middleware qui permet de vérifier l'état de la session de l'utilisateur
function checkSessionMiddeleware(req, res, next) {
    // Récupération de la session de l'utilisateur émetteur de la requête
    const sess = req.session;
    // Vérification de la présence des valeurs dans le stockage Redis donc de la validité de la session
    if (sess.username) {
        // Passage à l'étape suivante session valide
        return next();
    } else {
        // Erreur utilisateur non connecté ou bien session expirée
        res.status(403).send('Non authentifié');
    }
}
```

####  Exemple endpoint 

Voici un exemple pour une route de l'API qui permet de recuperer des données, uniquement si celui-ci à une session valide.

``` Javascript
// Exemple endpoint '/data' qui utilise le middleware 'checkSessionMiddeleware'
app.get('/data', checkSessionMiddeleware, (req, res) => {
    // middelware checkSessionMiddeleware passé
    // Récupération des données...
    // (apple des méthodes qui permet de récupérer des données sur une autre instance MySQL par exemple)
    res.send('Sessions utilisateur valide, accès aux données valide')
})
```

## Introspection sur l'Intégration de Redis

#### Les avantages de redis 

Redis, possède une multitude d’avantages qui peuvent le démarquer des différents SGBD. L’un des avantages le plus marquant est sa performance qui s’explique par le fait que les données sont chargées en mémoire dans l’objectif de permettre une lecture et une écriture de celles-ci plus rapide. Le SGBD offre aussi une excellente scalabilité horizontale puisqu’il permet de mettre en place des clusters qui permettent de gérer la charge de travail et la répartition des données entre les nœuds, mais cela permette également de s’adapter au volume des données stockées simplement en ajoutant un nouveau nœud (machine ou bien instances liées au cluster). Pour finir le dernier élément marquant est la fiabilité puisqu’il permet en répliquant les données et en faisant persister celles-ci sur le disque de garantir la disponibilité des données même en cas de panne.

#### Les projets existants où Redis pourrait être intégré

L’intégration du SGBD Redis peut se faire dans un grand nombre de projets, qui demande une lecture et/ou écriture des données fréquente avec une rapidité de réponse importante. Nous pouvons prendre l’exemple d’un serveur de gestion de sessions qui va être très souvent demandé que cela soit pour la lecture, mais également de l’écriture sa rapidité de réponse est importante puisqu'il permet d’offrir un meilleur service au client. Nous pouvons également prendre l’exemple d’un système de gestion stock et commande pour une boutique e-commerce la rapidité de réponse permet de réduire les délais de réponse, mais également les éventuelles erreurs. Ces deux exemples sont uniquement à titre indicatif l’utilisation de Redis est à favoriser dans une multitude de projets demandant une lecture et une écriture des données, mais également pour les projets demande une scalabilité. Les domaines dans lesquels utiliser Redis est très vaste.
