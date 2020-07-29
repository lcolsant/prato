const express = require('express');
const plateController = require('../controllers/plateController.js');

const router = express.Router();

router.route('/')
    .get(plateController.getAllPlates)
    .post(plateController.createPlate);

router.route('/:id')
    .get(plateController.getPlate)
    .patch(plateController.updatePlate)
    .delete(plateController.deletePlate)
    


module.exports = router;