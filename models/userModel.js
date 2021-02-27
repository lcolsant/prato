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
    username: {
        type: String,
        trim: true,
        minlength: 4,
        required: [true, 'Missing a username...']
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
        default: 'default-user.jpg'
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
    plates: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Plate'
        }
    ],
    week: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Plate',
            validate: [arrayLimit,'Cannot exceed 7 plates per week!'],
        }
    ],
    passwordChangedAt: Date,
});


userSchema.pre('save', async function(next) {
    
    //Only run this function if password was actually modified
    if(!this.isModified('password')) return next()

    //Hash password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();

});

userSchema.pre(/^find/, function(next){
    this.populate({
        path: 'plates',
        select: 'name description photo'
    });
    next();
});

userSchema.pre(/^find/, function(next){
    this.populate({
        path: 'week',
        select: 'name description photo'
    });
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

function arrayLimit (val) {

    console.log(val);
    return val.length < 8;
}

const User = mongoose.model('User', userSchema)

module.exports = User;