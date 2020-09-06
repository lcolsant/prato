const express = require('express');
const viewController = require('../controllers/viewContoller');


const router = express.Router()


router.get('/', viewController.getLanding);    
router.get('/plates', viewController.getPlates);    
router.get('/login', viewController.getLogin);    
router.get('/signup', viewController.getSignup);    
router.get('/create', viewController.createPlate)

module.exports = router;
