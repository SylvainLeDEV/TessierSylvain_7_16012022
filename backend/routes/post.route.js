const router = require('express').Router();
const postControllers = require('../controllers/post.controller');
const auth = require('../middleware/auth.middleware');

const multer = require('../middleware/multer-config');



// Routes for post and like
router.get('/', postControllers.readPost);
router.get('/:uuid', postControllers.readOnePost);
router.post('/', multer, postControllers.createPost);
router.put('/:uuid', multer,postControllers.updatePost);
router.delete('/:uuid', auth,postControllers.deletePost);


// Routes for comments
router.get('/comment-post/:uuid', postControllers.getCommentPost);
router.patch('/create-comment-post/', multer, postControllers.createCommentPost);
router.put('/edit-comment-post/:uuid', multer, postControllers.editCommentPost);
router.delete('/delete-comment-post/:uuid', postControllers.deleteCommentPost);


module.exports = router;