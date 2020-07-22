const mongoose = require('mongoose');
const validator = require('validator');
const { model } = require('./plateModel');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Missing a name...']
    },
    email:{
        type: String,
        required: [true, 'Missing an email...'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Please provide a valid email.']
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please provide a password'],
    },

});

const User = mongoose.model('User', userSchema)

model.exports = User;