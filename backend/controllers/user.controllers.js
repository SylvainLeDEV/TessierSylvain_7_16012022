const {User, Posts, Comments} = require("../models");
const fs = require("fs");


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
    console.log(uuid)
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
// ATTENTION AJOUTER L'AUTH !!!
    const uuidUser = req.params.uuid
    User.findOne({
        where: {uuid: uuidUser},
    })
        .then((user) => {

            // console.log("CONTROLE : ", user.uuid, req.auth.uuidUserToken)
            // if (user.uuid !== req.auth.uuidUserToken) {
            //     return res.status(400).json({
            //         message: 'Unauthorized request',
            //     })
            // }

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

    User.findOne({where: {uuid: uuidUser}})
        .then((user) => {

            if (!user) {
                return res.status(400).json({
                    message: "Utilisateur pas trouvé !"
                })
            }

            // if (user.uuid !== req.auth.uuidUserToken) {
            //     return res.status(400).json({
            //         message: 'Unauthorized request',
            //     })
            // }
            if (req.files.profile) {

                console.log(user.picture)
                const filename = user.picture.split('/images/profile/')[1];
                console.log(filename)
                fs.unlink(`images/profile/${filename}`, () => {
                    const profileObject = {
                        firstName,
                        lastName,
                        email,
                        poste,
                        bio,
                        picture: `${req.protocol}://${req.get('host')}/images/profile/${req.files.profile[0].filename}`
                    }
                    console.log(profileObject)
                    user.update(profileObject, {
                        where: req.params.uuid
                    }).then(() => {
                        return res.status(200).json({message: 'User upDate with picture'})
                    })
                        .catch((err) => {
                            return res.status(400).json({err, message: "Une erreur dans les donées"})
                        })
                })
            } else {

                const profileObject = {
                    firstName,
                    lastName,
                    email,
                    poste,
                    bio,
                }
                user.update(profileObject, {
                    where: req.params.uuid
                }).then(() => {
                    return res.status(200).json({message: 'User upDate'})
                })
                    .catch((err) => {
                        return res.status(400).json({err, message: "Une erreur dans les donées"})
                    })
            }
        })
        .catch((err) => {
            return res.status(500).json({err: err})
        })
}


//
// module.exports.follow = (req, res, next) => {
//     if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow))
//         return res.status(400).send('ID unknow : ' + req.params.id);
//
//     try {
//         //add to the follower list
//         userModel.findByIdAndUpdate(
//             req.params.id,
//             {$addToSet: {following: req.body.idToFollow}},
//             {new: true, upsert: true},
//             (err, docs) => {
//                 if (!err) res.status(201).json(docs)
//                 else return res.status(400).json(err)
//             }
//         );
//
//         //add to the following list
//         userModel.findByIdAndUpdate(
//             req.body.idToFollow,
//             {$addToSet: {followers: req.params.id}},
//             {new: true, upsert: true},
//             (err, docs) => {
//                 // if (!err) res.status(201).json(docs)
//                 if (err) return res.status(400).json(err)
//             }
//         );
//     } catch (err) {
//         return res.status(500).json({message: "Follow faild", err});
//     }
// }
//
// module.exports.unfollow = (req, res) => {
//     if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnFollow))
//         return res.status(400).send('ID unknow : ' + req.params.id);
//
//     try {
//         //add to the follower list
//         userModel.findByIdAndUpdate(
//             req.params.id,
//             {$pull: {following: req.body.idToUnFollow}},
//             {new: true, upsert: true},
//             (err, docs) => {
//                 if (!err) res.status(201).json(docs)
//                 else return res.status(400).json(err)
//             }
//         );
//
//         //Remove to the following list
//         userModel.findByIdAndUpdate(
//             req.body.idToUnFollow,
//             {$pull: {followers: req.params.id}},
//             {new: true, upsert: true},
//             (err, docs) => {
//                 // if (!err) res.status(201).json(docs)
//                 if (err) return res.status(400).json(err)
//             }
//         );
//     } catch (err) {
//         return res.status(500).json({message: "Unfollow faild", err});
//     }
// }