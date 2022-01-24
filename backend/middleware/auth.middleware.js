const jsonwebtoken = require('jsonwebtoken');
const dotenv = require('dotenv').config({path: './config/.env', encoding: "latin1"});

// Un middleware est un bloc de code qui traite les requêtes et réponses de votre application.
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jsonwebtoken.decode(token, process.env.TOKEN_KEY);
        const uuidUserToken = decodedToken.uuidUser;
        const isAdminToken = decodedToken.isAdmin;
        //nous ajoutons un objet  auth  à l'objet de requête qui contient le  userId  extrait du token
        req.auth = {uuidUserToken: uuidUserToken};
        req.admin = {isAdminToken: isAdminToken};
        if (req.body.uuid && req.body.uuid !== uuidUserToken) {
            return res.status(401).json({message: "invalid ID user"})
        } else {
            next();
        }
    } catch {
        res.status(400).json({
            error: new Error('Invalid request!')
        });
    }
};