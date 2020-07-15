const Plate = require('../models/plateModel');

exports.getAllPlates = (req, res) => {
    res.send('Retrieving all plates...')
}

exports.createPlate = (req, res) => {
    res.send('Creating a new plate...')
}