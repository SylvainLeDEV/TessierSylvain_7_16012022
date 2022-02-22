const express = require('express');
const helmet = require('helmet');
const rateLimite = require('express-rate-limit');
const userRoutes = require('./routes/user.route');
const postRoutes = require('./routes/post.route');
require('dotenv').config({ path: './config/.env',encoding: "latin1" });
const bodyParser = require("body-parser");

const {User} = require("./models");
const path = require("path");

const app = express();


//CORS Police : Cross Origin Resource Sharing
app.use((req, res, next) => {
    // d'accéder à notre API depuis n'importe quelle origine ( '*' ) ;
    res.setHeader('Access-Control-Allow-Origin', '*');
    // d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) ;
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.).
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


// Par exemple, Node.js a un module de cookies avec HttpOnly, et un middleware appelé Helmet. XSS
//X-Frame-Options :afin d'éviter les attaques de clickjacking
app.use(helmet.frameguard({
        action : "SAMEORIGIN"
    })
);

// Avec ceci, Express prend toutes les requêtes qui ont comme Content-Type  application/json
// parse application/json, basically parse incoming Request Object as a JSON Object
app.use(bodyParser.json());
// or app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(rateLimite({
    windowMs: 24 * 60 * 60 * 1000,
    max: 10000,
    message: "Vous avez effectué plus de 100 requétes dans une limite de 24 heures!",
    headers: true,
}));

// Router
app.use('/images/posts', express.static(path.join(__dirname, 'images/posts')));
app.use('/images/profile', express.static(path.join(__dirname, 'images/profile')));
app.use('/images/pictureProfile', express.static(path.join(__dirname, 'images/pictureProfile')));
app.use('/images/comment', express.static(path.join(__dirname, 'images/comment')));
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

module.exports = app;