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
        trim: true,
        maxlength: 270,
    },
    recipe: {
        type: String,
        trim: true
    },
    photo: {
        type: String,
        default: 'default-plate.jpg'
    },
    user: {
        type: String,
        required: [true, 'A plate must belong to a user']
    }, 
    slug: String,
});

// plateSchema.pre(/^find/, function(next){
//     this.populate({
//         path: 'user',
//         select: 'name'
//     });
//     next();
// });

const Plate = mongoose.model('Plate', plateSchema);

module.exports = Plate;