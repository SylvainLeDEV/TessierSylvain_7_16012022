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
                as: 'comment',
                include: [{
                    model: User,
                    as: 'userComment'
                }]
            }
        ]
    })
        .then((posts) => {
            const post = posts.sort(function (a, b) {
                return b.createdAt - a.createdAt
            })

            posts.forEach((post) => {
                const comment = post.comment.sort(function (a, b) {
                    return b.createdAt - a.createdAt;
                })
                return post.comment = comment;
            })

            return res.status(200).json(post)
        })
        .catch((error) => {
            return res.status(500).json({error: error})
        })
}

module.exports.createPost = async (req, res, next) => {
    const {content, videoUrl, userUuid} = req.body
    let imageUrl = null
    if (req.files) {
        imageUrl = `${req.protocol}://${req.get('host')}/images/posts/${req.files.posts[0].filename}`
    }
    User.findOne({where: {uuid: userUuid}})
        .then((user) => {
            if (!user)
                return res.status(401).json({message: "Utilisateur non trouvé !"})
            Posts.create({content, imageUrl, videoUrl, userName: user.firstName, userId: user.id})
                .then(() => {
                        res.status(201).json({
                            message: 'Post saved successfully!',

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
    const uuidPost = req.params.uuid
    const {content, videoUrl} = req.body
    Posts.findOne({where: {uuid: uuidPost},include: [
            {
                model: User,
                as: 'User'
            },
            {
                model: Comments,
                as: 'comment',
                include: [{
                    model: User,
                    as: 'userComment'
                }]
            }
        ]})
        .then((post) => {

            if (!post) {
                return res.status(401).json({message: "Pas de post trovué ! "})
            }

            if (post.User.uuid !== req.auth.uuidUserToken) {
                return res.status(400).json({
                    message: 'Unauthorized request',
                })
            }

            if (req.files && req.files.post) {
                const filename = post.imageUrl.split('/images/posts')[1];
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

    const uuidPost = req.params.uuid
    Posts.findOne({
        where: {uuid: uuidPost}, include: [
            {
                model: User,
                as: 'User'
            },
            {
                model: Comments,
                as: 'comment',
                include: [{
                    model: User,
                    as: 'userComment'
                }]
            }
        ]
    })
        .then((post) => {
            if (!post) {
                return res.status(401).json({message: "Pas de post trovué ! "})
            }

            if (req.isAdmin.isAdminToken) {
                post.destroy()
                return res.status(200).json({message: 'Post destroy by Admin'})
            }

            if (post.User.uuid !== req.auth.uuidUserToken) {
                return res.status(400).json({
                    message: 'Unauthorized request',
                })
            }
            // Ajout de photos mis en stand-by pour le moment
            // const filename = post.imageUrl.split('/images/posts')[1];
            // fs.unlink(`images/posts/${filename}`, () => {
            // })
            post.destroy()
            return res.status(200).json({message: 'Post destroy'})

        })
        .catch((err) => {
            return res.status(500).json({err: err})
        })
}

module.exports.createCommentPost = async (req, res, next) => {
    const {content, videoUrl, postUuid, posterId} = req.body
    let imageUrl = null
    if (req.files) {
        const imageUrl = `${req.protocol}://${req.get('host')}/images/comment/${req.files.comment[0].filename}`
    }
    User.findOne({where: {uuid: posterId}})
        .then((user) => {
            Posts.findOne({where: {uuid: postUuid}})
                .then((post) => {

                    if (!post)
                        return res.status(401).json({message: "Post non trouvé !"})

                    Comments.create({
                        userName: user.firstName,
                        content,
                        imageUrl,
                        videoUrl,
                        pictureUserProfile: user.picture,
                        postId: post.id,
                        posterId: posterId,
                        userId: user.id
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
                .catch((error) => {
                    res.status(400).json({
                        error: error
                    })
                })
        })
        .catch((error) => {
            res.status(400).json({
                error: error
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

            Comments.findAll({where: {postId: post.id}, include: [User]})
                .then((comment) => {
                    const comments = comment.sort(function (a, b) {
                        return b.createdAt - a.createdAt
                    })

                    return res.status(200).json(["post : ", post, "comment :", [comments]])
                })
                .catch((error) => {
                    return res.status(500).json({error: error})
                })
        })
}

module.exports.editCommentPost = (req, res, next) => {

    const uuidComment = req.params.uuid
    const {content, videoUrl} = req.body
    Comments.findOne({where: {uuid: uuidComment}})
        .then((comment) => {
            if (!comment) {
                return res.status(401).json({message: "Pas de comentaire trouvé !"})
            }

                if (comment.posterId !== req.auth.uuidUserToken) {
                return res.status(400).json({
                    message: 'Unauthorized request',
                })
            }

            if (req.files && req.files.comment) {
                const filename = comment.imageUrl.split('/images/comment')[1];

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


    const uuidComment = req.params.uuid
    Comments.findOne({
        where: {uuid: uuidComment},
    })
        .then((comment) => {

            if (!comment) {
                return res.status(401).json({message: "Pas de commentaire trovué ! "})
            }

            if (req.isAdmin.isAdminToken){
                comment.destroy()
                return res.status(200).json({message: 'Comment destroy by Admin'})
            }

            if (comment.posterId !== req.auth.uuidUserToken) {
                return res.status(400).json({
                    message: 'Unauthorized request',
                })
            }
// Ajout de photos mis en stand-by pour le moment
            // let filename = null
            // if (req.files && req.files.comment) {
            //     const filename = comment.imageUrl.split('/images/comment/')[1];
            //
            //     fs.unlink(`images/comment/${filename}`, () => {
            //     })
            // }
            comment.destroy()
            return res.status(200).json({message: 'Comment destroy'})
        })
        .catch((err) => {
            return res.status(500).json({err: err})
        })
}
