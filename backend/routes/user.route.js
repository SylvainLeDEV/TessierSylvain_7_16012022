const router = require('express').Router();
const authController = require('../controllers/auth.controllers');
const userController = require('../controllers/user.controllers');
const auth = require('../middleware/auth.middleware');
const multer = require('../middleware/multer-config');


//Authentification
router.post("/register", authController.signUp);
router.post("/login/", authController.login);
router.get("/logout", authController.logout);

//User DB
router.get("/", auth,userController.getAllUsers);
router.get("/:uuid", auth ,  userController.userInfo);
router.put("/:uuid", auth, multer,userController.updateUser);
router.delete("/:uuid", auth,userController.deleteUser);

//Upload
// router.post("/upload", multer, uploadController.uploadProfil);

module.exports = router;