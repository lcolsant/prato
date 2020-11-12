const express = require('express');
const userController = require('../controllers/userController.js');
const authController = require('../controllers/authContoller');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/me', userController.getMe);

router.route('/')
    .get(authController.protect, userController.getAllUsers)
    .post(userController.createUser)
    .patch(authController.protect, authController.updatePassword)


router.route('/:id')
    .get(userController.getUser)
    .patch(authController.protect, userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateUser)
    // .patch(authController.protect, authController.updatePassword)
    .delete(userController.deleteUser)


module.exports = router;