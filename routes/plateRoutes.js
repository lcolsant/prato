const express = require('express');
const plateController = require('../controllers/plateController.js');
const authController = require('../controllers/authContoller');



const router = express.Router();

router.route('/')
    .get(authController.protect, plateController.getAllPlates)
    .post(authController.protect, plateController.uploadPlatePhoto, plateController.resizePlatePhoto,plateController.createPlate);

router.route('/:id')
    .get(plateController.getPlate)
    .patch(authController.protect, plateController.uploadPlatePhoto, plateController.resizePlatePhoto ,plateController.updatePlate)
    .delete(plateController.deletePlate)
    .post(plateController.addToWeek)

router.delete('/remove/:id', plateController.removeFromWeek);
router.patch('/week/update', plateController.updateWeek);
router.get('/week/email', plateController.emailWeek);
    


module.exports = router;