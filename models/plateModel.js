const mongoose = require('mongoose');

const plateSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'Please provide a plate name']
    },
    description: {
        type: String,
        trim: true
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    slug: String,
    
})

const Plate = mongoose.model('Plate', plateSchema);

module.exports = Plate;