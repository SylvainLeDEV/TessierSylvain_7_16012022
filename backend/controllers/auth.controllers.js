const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: './config/.env', encoding: "latin1"});

const {User} = require("../models");
const {UUIDV4} = require("sequelize");

// const errorsUtils = require('../utils/errors.utils');
//JWT sont des jetons générés par un serveur lors de l’authentification
// d’un utilisateur sur une application Web, et qui sont ensuite transmis au client.
// const jwt = require("jsonwebtoken");
//
// const maxAge = 3 * 24 * 60 * 60 * 1000
// const createToken = (id) => {
//     return jwt.sign({id}, process.env.TOKEN_SECRET, {
//         expiresIn: maxAge
//     })
// }

module.exports.signUp = (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            User.create({
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                poste: req.body.poste,
                isAdmin: req.body.isAdmin,
                password: hash
            })
                .then((user) => {
                    return res.status(201).send(user)
                })
                .catch((err) => {
                    res.status(500).json({err: err, message: 'problème sur /register ou fonction SignIn'})
                })
        })
        .catch(error => res.status(500).json({error: error}));
};

exports.login = (req, res, next) => {
    User.findOne( { where: {email : req.body.email}})
        .then(user => {
            console.log(user)
            if (!user){
                return res.status(401).json({ message: 'Utilisateur non trouvé ! ' })
            }

            bcrypt.compare(req.body.password, user.password )
                .then(valid => {
                    console.log(valid)
                    console.log(user.uuid)
                    if (!valid){
                        return res.status(401).json({ message: 'Mot de passe incorrect! ' })
                    }
                    return res.status(200).send({
                        userId: user.uuid,
                        // La méthode  sign()  du package  jsonwebtoken  utilise une clé secrète pour encoder un token qui peut contenir un payload personnalisé et avoir une validité limitée.
                        token: jwt.sign(
                            { userId : user.uuid },
                            process.env.TOKEN_KEY,
                            { expiresIn : '24h' }
                        )
                    })
                })
                .catch(error => res.status(500).json({ error : error }))

        })
        .catch(error => res.status(500).json({ error : error }))

};


//
// //Vidéo : 2h00
// module.exports.signIn = async (req, res) => {
//     const {email, password} = req.body
//     console.log(email, password)
//
//     try {
//         const user = await userModel.login(email, password);
//         const token = createToken(user._id);
//         res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge})
//         res.status(200).json({user: user._id})
//     } catch (err) {
//         const errors = errorsUtils.signInErrors(err)
//         return res.status(200).send({ errors })
//     }
// };
//
// module.exports.logout = (req, res) => {
//     res.cookie('jwt', '', {maxAge: 1});
//     res.redirect("/");
// }
