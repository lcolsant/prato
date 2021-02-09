const express = require('express');
const plateController = require('../controllers/plateController.js');
const authController = require('../controllers/authContoller');



const router = express.Router();

router.route('/')
    .get(authController.protect, plateController.getAllPlates)
    .post(authController.protect, plateController.uploadPlatePhoto, plateController.resizePlatePhoto,plateController.createPlate);

router.route('/:id')
    .get(authController.protect, plateController.getPlate)
    .patch(authController.protect, plateController.uploadPlatePhoto, plateController.resizePlatePhoto ,plateController.updatePlate)
    .delete(authController.protect, plateController.deletePlate)
    .post(authController.protect, plateController.addToWeek)

router.delete('/remove/:id', authController.protect, plateController.removeFromWeek);
router.patch('/week/update', authController.protect, plateController.updateWeek);
router.get('/week/email', authController.protect, plateController.emailWeek);
    


module.exports = router;