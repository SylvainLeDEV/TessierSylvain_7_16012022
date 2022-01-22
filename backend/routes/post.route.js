const router = require('express').Router();
const postControllers = require('../controllers/post.controller');
const multer = require("multer");
const upload = multer();
const auth = require('../middleware/auth.middleware');




// Routes for post and like
router.get('/', postControllers.readPost);
router.post('/',postControllers.createPost);
router.put('/:uuid', postControllers.updatePost);
router.delete('/:uuid', postControllers.deletePost);


// Routes for comments
router.get('/comment-post/:uuid', postControllers.getCommentPost);
router.patch('/create-comment-post/', postControllers.createCommentPost);
router.put('/edit-comment-post/:uuid', postControllers.editCommentPost);
router.delete('/delete-comment-post/:uuid', postControllers.deleteCommentPost);


module.exports = router;