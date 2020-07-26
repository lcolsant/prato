const express = require('express');
const plateController = require('../controllers/plateController.js');

const router = express.Router();

router.route('/')
    .get(plateController.getAllPlates)
    .post(plateController.createPlate);

router.route('/:id')
    .get(plateController.getPlate)
    


module.exports = router;