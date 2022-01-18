const router = require('express').Router();
const postControllers = require('../controllers/post.controller');
const multer = require("multer");
const upload = multer();



// Routes for post and like
router.get('/', postControllers.readPost);
router.post('/',postControllers.createPost);
// router.put('/:id', postControllers.updatePost);
// router.delete('/:id', postControllers.deletePost);


// Routes for comments
// router.patch('/comment-post/:id', postControllers.commentPost);
// router.patch('/edit-comment-post/:id', postControllers.editCommentPost);
// router.patch('/delete-comment-post/:id', postControllers.deleteCommentPost);


module.exports = router;