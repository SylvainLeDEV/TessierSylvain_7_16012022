const {Posts} = require('../models/');
const {User} = require('../models/');
const {Comments} = require('../models/')
// const {uploadErrors} = require("../utils/errors.utils");
const fs = require("fs");
// const {promisify} = require("util");
// const pipeline = promisify(require('stream').pipeline);
//
// const ObjectID = require('mongoose').Types.ObjectId;

module.exports.readPost = (req, res, next) => {
    Posts.findAll({include: [User, Comments]})
        .then((posts) => {
            const post = posts.sort(function (a, b) {
                return b.createdAt - a.createdAt
            })
            return res.status(200).json(post)
        })
        .catch((error) => {
            return res.status(500).json({error: error})
        })
}

module.exports.createPost = async (req, res, next) => {
    const {content, videoUrl, userUuid} = req.body
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
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

module.exports.readOnePost = (req, res, next) => {
    // ATTENTION AJOUTER L'AUTH !!!
    // METTRE EN PLACE le isAdmin
    const uuidPost = req.params.uuid

    Posts.findOne({where: {uuid: uuidPost}, include: [User, Comments]})
        .then((post) => {

            if (!post) {
                return res.status(400).json({message: "Pas de post !"})
            }

            return res.status(200).json(post)
        })
        .catch((err) => {
            return res.status(500).json({err: err})
        })
}

module.exports.updatePost = (req, res, next) => {
    // METTRE EN PLACE le isAdmin
    const uuidPost = req.params.uuid
    const {content, videoUrl} = req.body
    console.log(req.body)
    Posts.findOne({where: {uuid: uuidPost}})
        .then((post) => {
            const filename = post.imageUrl.split('/images/posts')[1];
            if (!post) {
                return res.status(401).json({message: "Pas de post trovué ! "})
            }

            // if (post.User.uuid !== req.auth.uuidUserToken) {
            //     return res.status(400).json({
            //         message: 'Unauthorized request',
            //     })
            // }

            if (req.file) {
                fs.unlink(`images/posts/${filename}`, () => {
                    const postObject = {
                        content,
                        videoUrl,
                        imageUrl:`${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`
                    }
                    post.update(postObject, {
                        where : req.params.uuid
                    }).then(() => {
                        return res.status(200).json({message: 'Post upDate'})
                    })
                        .catch((err) => {
                            return res.status(400).json({err, message: "Une erreur dans les donées"})
                        })
                })
            } else {
                const postObject = {
                    content,
                    videoUrl,
                }
                post.update(postObject, {
                    where : req.params.uuid
                }).then(() => {
                    return res.status(200).json({message: 'Post upDate'})
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

module.exports.deletePost = (req, res, next) => {
    // ATTENTION AJOUTER L'AUTH !!!
    // METTRE EN PLACE le isAdmin
    const uuidPost = req.params.uuid
    Posts.findOne({
        where: {uuid: uuidPost}, include: [User, Comments]
    })
        .then((post) => {
            if (!post) {
                return res.status(401).json({message: "Pas de post trovué ! "})
            }
            if (post.User.uuid !== req.auth.uuidUserToken) {
                return res.status(400).json({
                    message: 'Unauthorized request',
                })
            }
            const filename = post.imageUrl.split('/images/posts')[1];
            fs.unlink(`images/posts/${filename}`, {})

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


module.exports.createCommentPost = (req, res, next) => {
    const {content, imageUrl, videoUrl, postUuid, posterId} = req.body
    User.findOne({where: {uuid: posterId}})
        .then((user) => {
            const userId = user.id
            console.log(userId)
            Posts.findOne({where: {uuid: postUuid}})
                .then((post) => {
                    console.log(post)
                    if (!post)
                        return res.status(401).json({message: "Post non trouvé !"})
                    console.log(post)

                    Comments.create({content, imageUrl, videoUrl, postId: post.id, posterId: posterId, userId: userId})
                        .then(() => {
                                res.status(201).json({
                                    message: 'Comment saved successfully!'
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
        })
}

module.exports.getCommentPost = (req, res, next) => {
    const uuidPost = req.params.uuid
    Posts.findOne({where: {uuid: uuidPost}, include: [User]})
        .then((post) => {
            if (!post) {
                return res.status(400).json({message: "Pas de post trouvé !"})
            }
            console.log(post)
            Comments.findAll({where: {postId: post.id}, include: [User]})
                .then((comment) => {
                    const comments = comment.sort(function (a, b) {
                        return b.createdAt - a.createdAt
                    })
                    console.log("ICI : ", comments)
                    return res.status(200).json(["post : ", post, "comment :", [comments]])
                })
                .catch((error) => {
                    return res.status(500).json({error: error})
                })
        })
}

module.exports.editCommentPost = (req, res, next) => {

    // ATTENTION AJOUTER L'AUTH !!!
    // METTRE EN PLACE le isAdmin

    const uuidComment = req.params.uuid
    const {content, imageUrl, videoUrl} = req.body
    Comments.findOne({where: {uuid: uuidComment}})
        .then((comment) => {
            if (!comment) {
                return res.status(401).json({message: "Pas de comentaire trouvé !"})
            }
            console.log(comment)

            comment.content = content
            comment.imageUrl = imageUrl
            comment.videoUrl = videoUrl
            comment.save().then(() => {
                return res.status(200).json({message: 'comment upDate'})
            })
                .catch((err) => {
                    return res.status(400).json({err, message: "Une erreur dans les donées"})
                })
        })
}

module.exports.deleteCommentPost = (req, res, next) => {

    // ATTENTION AJOUTER L'AUTH !!!
    // METTRE EN PLACE le isAdmin

    const uuidComment = req.params.uuid
    Comments.findOne({
        where: {uuid: uuidComment},
    })
        .then((comment) => {

            if (!comment) {
                return res.status(401).json({message: "Pas de commentaire trovué ! "})
            }

            console.log(comment)
            comment.destroy()
            return res.status(200).json({message: 'Comment destroy'})
        })
        .catch((err) => {
            return res.status(500).json({err: err})
        })
}
