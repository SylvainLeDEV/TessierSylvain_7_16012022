const {Posts} = require('../models/');
const {User} = require('../models/');
const {Comments} = require('../models/')
// const {uploadErrors} = require("../utils/errors.utils");
const fs = require("fs");


module.exports.readPost = (req, res, next) => {
    Posts.findAll({
        include: [
            {
                model: User,
                as: 'User'
            },
            {
                model: Comments,
                as: 'comment'
            }
        ]
    })
        .then((posts) => {
            console.log(posts)
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
    const imageUrl = `${req.protocol}://${req.get('host')}/images/posts/${req.files.posts[0].filename}`
    User.findOne({where: {uuid: userUuid}})
        .then((user) => {
            if (!user)
                return res.status(401).json({message: "Utilisateur non trouvé !"})
            Posts.create({content, imageUrl, videoUrl, userName: user.firstName, userId: user.id})
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
        }).catch((err) => {
        return res.status(400).json({err, message: 'problème création post'})
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

            if (req.files.posts) {
                fs.unlink(`images/posts/${filename}`, () => {
                    const postObject = {
                        content,
                        videoUrl,
                        imageUrl: `${req.protocol}://${req.get('host')}/images/posts/${req.files.posts[0].filename}`
                    }
                    post.update(postObject, {
                        where: req.params.uuid
                    }).then(() => {
                        return res.status(200).json({message: 'Post upDate with image'})
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
                    where: req.params.uuid
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


module.exports.createCommentPost = async (req, res, next) => {
    const {content, videoUrl, postUuid, posterId} = req.body
    console.log("Req.file", req.file)
    const imageUrl = `${req.protocol}://${req.get('host')}/images/comment/${req.files.comment[0].filename}`
    User.findOne({where: {uuid: posterId}})
        .then((user) => {
            const userId = user.id
            console.log("la userid", userId)
            Posts.findOne({where: {uuid: postUuid}})
                .then((post) => {
                    console.log(post)
                    if (!post)
                        return res.status(401).json({message: "Post non trouvé !"})
                    console.log(post)

                    Comments.create({
                        userName: user.firstName,
                        content,
                        imageUrl,
                        videoUrl,
                        postId: post.id,
                        posterId: posterId,
                        userId: userId
                    })
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
    const {content, videoUrl} = req.body
    Comments.findOne({where: {uuid: uuidComment}})
        .then((comment) => {
            const filename = comment.imageUrl.split('/images/comment')[1];
            if (!comment) {
                return res.status(401).json({message: "Pas de comentaire trouvé !"})
            }

            // if (comment.User.uuid !== req.auth.uuidUserToken) {
            //     return res.status(400).json({
            //         message: 'Unauthorized request',
            //     })
            // }
            if (req.files.comment) {
                console.log(req.files)
                fs.unlink(`images/comment/${filename}`, () => {
                    const commentObject = {
                        content,
                        videoUrl,
                        imageUrl: `${req.protocol}://${req.get('host')}/images/comment/${req.files.comment[0].filename}`
                    }
                    comment.update(commentObject, {
                        where: req.params.uuid
                    }).then(() => {
                        return res.status(200).json({message: 'Post upDate with image'})
                    })
                        .catch((err) => {
                            return res.status(400).json({err, message: "Une erreur dans les donées"})
                        })
                })
            } else {
                const commentObject = {
                    content,
                    videoUrl
                }
                comment.update(commentObject, {
                    where: req.params.uuid
                }).then(() => {
                    return res.status(200).json({message: 'comment upDate'})
                })
                    .catch((err) => {
                        return res.status(400).json({err, message: "Une erreur dans les donées"})
                    })
            }
        })
        .catch((err) => res.status(500).json({err, message: "Probleme sur update commentaire"}))
}

module.exports.deleteCommentPost = (req, res, next) => {

    // ATTENTION AJOUTER L'AUTH !!!
    // METTRE EN PLACE le isAdmin

    const uuidComment = req.params.uuid
    Comments.findOne({
        where: {uuid: uuidComment},
    })
        .then((comment) => {
            console.log(comment)

            if (!comment) {
                return res.status(401).json({message: "Pas de commentaire trovué ! "})
            }
            const filename = comment.imageUrl.split('/images/comment/')[1];
            fs.unlink(`images/comment/${filename}`, () => {
            })

            console.log(comment)
            comment.destroy()
            return res.status(200).json({message: 'Comment destroy'})
        })
        .catch((err) => {
            return res.status(500).json({err: err})
        })
}
