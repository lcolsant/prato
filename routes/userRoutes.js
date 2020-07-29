const express = require('express');
const userController = require('../controllers/userController.js');
const authController = require('../controllers/authContoller');

const router = express.Router();

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser)

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

router.post('/signup', authController.signup);

module.exports = router;