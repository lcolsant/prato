const mongoose = require('mongoose');

const plateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a plate name']
    },
    photo: {
        type: String,
        default: 'default.jpg'
    }
})

const Plate = mongoose.model('Plate', plateSchema);

module.exports = Plate;