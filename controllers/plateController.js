const Plate = require('../models/plateModel');

exports.getAllPlates = (req, res) => {
    //res.send('Retrieving all plates...')
    res.status(200).json({
        status: 'success',
        data: {
            data: 'Retrieving all plates...'
        }
    })
}

exports.createPlate = (req, res) => {
    //res.send('Creating a new plate...')
    res.status(200).json({
        status: 'success',
        data: {
            data: 'Creating a new plate...'
        }
    })
}