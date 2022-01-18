const {Posts} = require('../models/');
const {User} = require('../models/');
// const {uploadErrors} = require("../utils/errors.utils");
// const fs = require("fs");
// const {promisify} = require("util");
// const pipeline = promisify(require('stream').pipeline);
//
// const ObjectID = require('mongoose').Types.ObjectId;

module.exports.readPost = (req, res, next) => {
    Posts.findAll({include: [User]})
        .then((posts) => {
            const post = posts.sort(function (a, b) {
                return b.createdAt - a.createdAt
            })
            console.log("ICI : ", posts)
            return res.status(200).json(post)
        })
        .catch((error) => {
            return res.status(500).json({error: error})
        })
}

module.exports.createPost = async (req, res, next) => {
    const {content, imageUrl, videoUrl, userUuid} = req.body
    User.findOne({where: {uuid: userUuid}})
        .then((user) => {
            console.log(user)
            if (!user)
                return res.status(401).json({message: "Utilisateur non trouvé !"})

            Posts.create({content, imageUrl, videoUrl, userId: user.id})
                .then(() => {
                        res.status(201).json({
                            message: 'Post saved successfully!'
                        });
                    }
                )
                .catch((error) => {
                        res.status(400).json({
                            error: error
                        });
                    }
                );
        })
}

module.exports.updatePost = (req, res, next) => {
    // ATTENTION AJOUTER L'AUTH !!!
    const uuidPost = req.params.uuid
    const {content, imageUrl, videoUrl} = req.body

    Posts.findOne({where: {uuid: uuidPost}})
        .then((post) => {
            post.content = content
            post.imageUrl = imageUrl
            post.videoUrl = videoUrl
            post.save().then(() => {
                return res.status(200).json({message: 'Post upDate'})
            })
                .catch((err) => {
                    return res.status(400).json({err, message: "Une erreur dans les donées"})
                })

        })
        .catch((err) => {
            return res.status(500).json({err: err})
        })
}

module.exports.deletePost = (req, res, next) => {
    // ATTENTION AJOUTER L'AUTH !!!
    const uuidPost = req.params.uuid
    console.log(uuidPost)
    Posts.findOne({
        where: {uuid: uuidPost},
    })
        .then((post) => {
            console.log(post)
            post.destroy()
            return res.status(200).json({message: 'Post destroy'})
        })
        .catch((err) => {
            return res.status(500).json({err: err})
        })
}

// module.exports.likePost = (req, res, next) => {
//     if (!ObjectID.isValid(req.params.id))
//         return res.status(400).send('ID unknow : ' + req.params.id);
//     try {
//         postModel.findByIdAndUpdate(
//             req.params.id,
//             {$addToSet: {likers: req.body.id}},
//             {new: true},
//             (err, docs) => {
//                 if (err) res.status(400).send(err);
//             }
//         );
//         userModel.findByIdAndUpdate(
//             req.body.id,
//             {$addToSet: {likes: req.params.id}},
//             {new: true},
//             (err, docs) => {
//                 if (!err) res.status(200).send(docs);
//                 else return res.status(400).send(err)
//             }
//         );
//     } catch (err) {
//         return res.status(400).send({err})
//     }
// }
//
// module.exports.unlikePost = (req, res, next) => {
//     if (!ObjectID.isValid(req.params.id))
//         return res.status(400).send('ID unknow : ' + req.params.id);
//
//     try {
//         postModel.findByIdAndUpdate(
//             req.params.id,
//             {$pull: {likers: req.body.id}},
//             {new: true},
//             (err, docs) => {
//                 if (err) res.status(400).send(err);
//             }
//         );
//         userModel.findByIdAndUpdate(
//             req.body.id,
//             {$pull: {likes: req.params.id}},
//             {new: true},
//             (err, docs) => {
//                 if (!err) res.status(200).send(docs);
//                 else return res.status(400).send(err)
//             }
//         );
//     } catch (err) {
//         return res.status(400).send({err})
//     }
//
//
// }
//
// // router.patch('/comment-post/:id', postControllers.commentPost);
// // router.patch('/edit-comment-post/:id', postControllers.editCommentPost);
// // router.patch('/delete-comment-post/:id', postControllers.deleteCommentPost);
//
// module.exports.commentPost = (req, res, next) => {
//     if (!ObjectID.isValid(req.params.id))
//         return res.status(400).send('ID unknow : ' + req.params.id);
//
//     try {
//         return postModel.findByIdAndUpdate(
//             req.params.id,
//             {
//                 $push: {
//                     comments: {
//                         commenterId: req.body.commenterId,
//                         commenterPseudo: req.body.commenterPseudo,
//                         text: req.body.text,
//                         timestamp: new Date().getTime()
//                     }
//                 }
//             }, {new: true},
//             (err, docs) => {
//                 if (!err) res.status(200).send(docs);
//                 else return res.status(400).send(err)
//             }
//         )
//     } catch (err) {
//         return res.status(400).send({err})
//     }
// }
//
// module.exports.editCommentPost = (req, res, next) => {
//     if (!ObjectID.isValid(req.params.id))
//         return res.status(400).send('ID unknow : ' + req.params.id);
//
//     try {
//         return postModel.findById(req.params.id, (err, docs) => {
//             const theComment = docs.comments.find((comment) => {
//                 return comment._id.equals(req.body.commentId)
//             })
//             if (!theComment) return res.status(400).send('Comment not found');
//             theComment.text = req.body.text;
//
//             return docs.save((err) => {
//                 if (!err) res.status(200).send(docs);
//                 else return res.status(400).send(err)
//             })
//         })
//     } catch (err) {
//         return res.status(400).send({err})
//     }
// }
//
// module.exports.deleteCommentPost = (req, res, next) => {
//     if (!ObjectID.isValid(req.params.id))
//         return res.status(400).send('ID unknow : ' + req.params.id);
//
//     try {
//         return postModel.findByIdAndUpdate(
//             req.params.id,
//             {
//                 $pull: {
//                     comments: {
//                         _id: req.body.commentId
//                     }
//                 }
//             }, {new: true},
//             (err, docs) => {
//                 if (!err) res.status(200).send(docs);
//                 else return res.status(400).send(err)
//             }
//         )
//
//     } catch (err) {
//         return res.status(400).send({err})
//     }
// }
