// Importation des dépendances nécessaires
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const passport = require('./passport');
const authRoutes = require('./authRoutes');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
const cors = require('cors');
const session = require('express-session');
const flash = require('connect-flash');
const morgan = require('morgan'); // Logger pour Express
const compression = require('compression'); // Compression des réponses

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration de sécurité avec Helmet pour définir des en-têtes HTTP sécurisés
app.use(helmet());

// Utilisation de morgan pour la journalisation
app.use(morgan('combined'));

// Compression des réponses pour améliorer les performances
app.use(compression());

// Configuration de la limitation de taux pour empêcher les attaques par force brute
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limite chaque IP à 100 requêtes par fenêtre
});
app.use(apiLimiter);

// Configuration CORS pour permettre ou restreindre les requêtes cross-origin
const corsOptions = {
    origin: ['http://127.0.0.1:8080', 'http://localhost:8080'], // Remplacez par votre domaine
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware pour traiter les requêtes JSON
app.use(express.json());

// Configuration de la session
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret', // Utilisation de la variable d'environnement pour le secret
    resave: false,
    saveUninitialized: true
}));

// Configuration de flash pour les messages temporaires entre les requêtes
app.use(flash());
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Initialisation de Passport pour l'authentification
app.use(passport.initialize());

// Routes d'authentification
app.use('/auth', authRoutes);

// Route racine pour vérifier si le serveur fonctionne
app.get('/', (req, res) => {
    res.send('Serveur fonctionne');
});

// Gestionnaire d'erreurs pour attraper les erreurs inattendues
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Quelque chose a mal tourné !');
});

// Configuration de la connexion à la base de données
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shapshap';
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connecté à la base de données MongoDB');
}).catch(err => {
    console.error('Erreur de connexion à MongoDB:', err.message);
});

// Démarrer le serveur Express
app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});
