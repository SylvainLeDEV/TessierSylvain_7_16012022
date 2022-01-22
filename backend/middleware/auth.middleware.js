const jsonwebtoken = require('jsonwebtoken');
const dotenv = require('dotenv').config({path: './config/.env' , encoding: "latin1" });

// Un middleware est un bloc de code qui traite les requêtes et réponses de votre application.
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log(token)
        const decodedToken = jsonwebtoken.verify(token, process.env.TOKEN_KEY);
        const uuidUser = decodedToken.uuidUser;
        const isAdmin = decodedToken.isAdmin
        //nous ajoutons un objet  auth  à l'objet de requête qui contient le  userId  extrait du token
        req.auth = { uuidUser: uuidUser };
        req.auth = { isAdmin: isAdmin };
        if (req.body.uuidUser && req.body.uuidUser !== uuidUser) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};