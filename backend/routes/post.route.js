const router = require('express').Router();
const postControllers = require('../controllers/post.controller');
const auth = require('../middleware/auth.middleware');

const multer = require('../middleware/multer-config');



// Routes for post and like
router.get('/', auth,postControllers.readPost);
router.get('/:uuid', auth,postControllers.readOnePost);
router.post('/createpost', auth, multer, postControllers.createPost);
router.put('/:uuid', auth, multer,postControllers.updatePost);
router.delete('/:uuid', auth,postControllers.deletePost);


// Routes for comments
router.get('/comment-post/:uuid', auth,postControllers.getCommentPost);
router.patch('/create-comment-post/', auth,multer, postControllers.createCommentPost);
router.put('/edit-comment-post/:uuid', auth, multer, postControllers.editCommentPost);
router.delete('/delete-comment-post/:uuid', auth,postControllers.deleteCommentPost);


module.exports = router;