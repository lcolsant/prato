const express = require('express');
const viewController = require('../controllers/viewContoller');
const authController = require('../controllers/authContoller');


const router = express.Router()

router.use(authController.isLoggedIn)

router.get('/', viewController.getLanding);    
router.get('/plates', authController.protect, viewController.getPlates);    
router.get('/plates/:id', authController.protect, viewController.getPlateDetail);    
router.get('/plates/update/:id', authController.protect, viewController.updatePlate);    
router.get('/login', viewController.getLogin);    
router.get('/signup', viewController.getSignup);    
router.get('/create', viewController.createPlate)
router.get('/week', viewController.getWeek)
router.get('/me', viewController.getMe)
router.get('/updatePassword', viewController.updatePassword)

module.exports = router;
