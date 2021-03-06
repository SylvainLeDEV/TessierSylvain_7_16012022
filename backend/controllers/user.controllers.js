const {User, Posts, Comments} = require("../models");
const fs = require("fs");
const bcrypt = require('bcrypt');


module.exports.getAllUsers = (req, res) => {
    User.findAll({include: "posts"})
        .then((users) => {
            return res.status(200).send(users)
        })
        .catch((err) => {
            res.status(500).json({err: 'Somthing'})
        })
};

module.exports.userInfo = (req, res, next) => {
    const uuid = req.params.uuid
    User.findOne({
        where: {uuid: uuid},
        include: [{model: Posts, as: "posts", include: ["comment"]}],
    })
        .then((user) => {
            user.posts.sort(function (a, b) {
                return b.createdAt - a.createdAt
            })
            return res.status(200).json(user)
        })
        .catch((err) => {
            return res.status(500).json({err})
        })
}

module.exports.deleteUser = (req, res, next) => {

    const uuidUser = req.params.uuid
    User.findOne({
        where: {uuid: uuidUser},
    })
        .then((user) => {

            if (user.uuid !== req.auth.uuidUserToken) {
                return res.status(400).json({
                    message: 'Unauthorized request',
                })
            }

            const filename = user.picture.split('/images/profile/')[1];
            fs.unlink(`images/profile/${filename}`, () => {

            })

            user.destroy()
            return res.status(200).json({message: 'User destroy'})
        })
        .catch((err) => {
            return res.status(500).json({err: err})
        })
}

module.exports.updateUser = async (req, res, next) => {
    const uuidUser = req.params.uuid
    const {firstName, lastName, email, poste, bio} = req.body
    let password;
    if (req.body.password){
    password = bcrypt.hashSync(req.body.password, 10);
    }
    console.log(password)
    User.findOne({where: {uuid: uuidUser}})
        .then((user) => {

            if (!user) {
                return res.status(400).json({
                    message: "Utilisateur pas trouv?? !"
                })
            }

            if (user.uuid !== req.auth.uuidUserToken) {
                return res.status(400).json({
                    message: 'Unauthorized request',
                })
            }

            if ( req.files && req.files.profile) {
                const filename = user.picture.split('/images/profile/')[1];
                fs.unlink(`images/profile/${filename}`, () => {
                    const profileObject = {
                        firstName,
                        lastName,
                        email,
                        poste,
                        bio,
                        picture: `${req.protocol}://${req.get('host')}/images/profile/${req.files.profile[0].filename}`
                    }

                    user.update(profileObject, {
                        where: req.params.uuid
                    }).then(() => {
                        return res.status(200).json({message: 'User upDate with picture', profileObject})
                    })
                        .catch((err) => {
                            return res.status(400).json({err, message: "Une erreur dans les don??es"})
                        })
                })
            } else {
                const profileObject = {
                    firstName, lastName, email, poste, bio,password
                }
                user.update(profileObject, {
                    where: req.params.uuid
                }).then(() => {
                    return res.status(200).json({message: 'User upDate'})
                })
                    .catch((err) => {
                        return res.status(400).json({err, message: "Une erreur dans les don??es"})
                    })
            }
        })
        .catch((err) => {
            return res.status(500).json({message: "Error update user" ,err: err})
        })
}
