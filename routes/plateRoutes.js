const express = require('express');
const plateController = require('../controllers/plateController.js');

const router = express.Router();

router.route('/')
    .get(plateController.getAllPlates)
    .post(plateController.createPlate);


module.exports = router;