
const { plates } = require('../dev-data/data/plates-dev');
const User = require('../models/userModel');
const Plate = require('../models/plateModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { nextTick } = require('process');
const AppError = require('../utils/appError');

// import { plates } from '../dev-data/data/plates-dev';


exports.getLogin = (req, res) => {
    res.status(200).render('login', {
        title: 'Login'
    });
}

exports.getSignup = (req, res) => {
    res.status(200).render('signup', {
        title: 'Sign Up'
    });
}

exports.getLanding = (req, res) => {
    res.status(200).render('index');
}

exports.getPlates = async (req, res) => {
    try { 
        console.log('in get plates');
        console.log(req.headers.cookie)
        const token = req.headers.cookie.split('=')[1]
        console.log(`Token: ${token}`)
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        console.log(decoded);
        
        console.log(`UserID: ${decoded.id}`)
        const user = await User.findById(decoded.id, (user)=>{
            if(user){
                console.log(`User retrieved: ${user}`)
            }
        });
        
        console.log(user.plates.length)

        res.status(200).render('plates', {
            title: 'My Plates',
            plates:user.plates
        });

    } catch(err) {
        console.log(`Something went wrong: ${err}`)
    }

}

exports.createPlate = (req, res) => {
    console.log('in create plate');
    

    res.status(200).render('createPlate', {
        title: 'Create Plate',
    });
}


exports.getWeek = async (req, res) => {
    const token = req.headers.cookie.split('=')[1]
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id, (user)=>{
        if(user){
            console.log(`User retrieved: ${user}`)
        }
    });
        
    res.status(200).render('week', {
        title: 'My Week',
        week: user.week
    });
}
exports.getPlateDetail = async (req, res) => {
    
    try {
        
        const plate = await Plate.findById(req.params.id);

        res.status(200).render('detail', {
            title: 'Plate Detail',
            plate: plate,
        });
        
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Error 💥 We\'re sorry, we can\'t find this plate on our server!', err
        });
    }
}

exports.updatePlate = async (req, res) => {
    
    const plate = await Plate.findById(req.params.id);


    try {
        res.status(200).render('updatePlate', {
            title: 'Update Plate',
            plate: plate,
        });

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Error 💥 updating plate in MongoDB..', err
        });
    }
}

exports.getMe = async (req, res) => {
    
    try {
        const token = req.headers.cookie.split('=')[1]
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id, (user)=>{
            if(user){
                console.log(`User retrieved: ${user}`)
            }
        });
    
        res.status(200).render('updateMe', {
            title: 'My Account',
            user: user,
        });

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Error 💥 retrieving account ...', err
        });
    }
}


exports.updatePassword = async (req, res) => {
    
    try {
        res.status(200).render('updatePassword', {
        });

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Error 💥 rendering update password template..', err
        });
    }
}