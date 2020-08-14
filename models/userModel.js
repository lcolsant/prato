const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
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
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please provide a password'],
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    passwordChangedAt: Date

});

userSchema.pre('save', async function(next) {
    
    //Only run this function if password was actually modified
    if(!this.isModified('password')) return next()

    //Hash password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();

});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {  
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {

        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        //console.log(changedTimestamp, JWTTimestamp);

        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
};

const User = mongoose.model('User', userSchema)

module.exports = User;