const router = require('express').Router();
const authController = require('../controllers/auth.controllers');
const userController = require('../controllers/user.controllers');
// const uploadController = require('../controllers/upload.controllers');
// const multer = require("multer");
// const upload = multer();

const multer = require('../middleware/multer-config');

//Authentification
router.post("/register", authController.signUp);
router.post("/login/", authController.login);
// router.get("/logout", authController.logout);

//User DB
router.get("/", userController.getAllUsers);
// router.get("/:id", userController.userInfo);
// router.put("/:id", userController.updateUser);
// router.delete("/:id", userController.deleteUser);

//Upload
// router.post("/upload", multer, uploadController.uploadProfil);


module.exports = router;