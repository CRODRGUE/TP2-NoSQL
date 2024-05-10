const express = require('express');
const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');
var bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('trust proxy', 1);
const RedisStore = connectRedis(session)

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



// Route pour l'authentification et la génération de la session de l'utilisateur
app.post("/login", (req, res) => {
    // Récupération des données de la requête
    const { username, password } = req.body
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

// Exemple endpoint '/data' qui utilise le middleware 'checkSessionMiddeleware'
app.get('/data', checkSessionMiddeleware, (req, res) => {
    // middelware checkSessionMiddeleware passé
    // Récupération des données...
    // (apple des méthodes qui permet de récupérer des données sur une autre instance MySQL par exemple)
    res.send('Sessions utilisateur valide, accès aux données valide')
})

app.listen(3000, () => {
    console.log("Serveur à l'écoute sur le port : 3000")
});
