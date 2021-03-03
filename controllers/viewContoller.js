const User = require('../models/userModel');
const Plate = require('../models/plateModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const AppError = require('../utils/appError');
// const { nextTick } = require('process');
// const { url } = require('inspector');
// const { serialize } = require('v8');

// const { plates } = require('../dev-data/data/plates-dev');
// import { plates } from '../dev-data/data/plates-dev';


exports.getLogin = (req, res) => {
    
    const url = req.originalUrl;

    res.status(200).render('index', {
        title: 'Login',
        url
    });
}

exports.getSignup = (req, res) => {
    
    const url = req.originalUrl;

    res.status(200).render('index', {
        title: 'Sign Up',
        url
    });
}

exports.getLanding = (req, res) => {
    
    const url = req.originalUrl;
    res.status(200).render('index', {
        env: process.env.NODE_ENV,
        aws_url: process.env.AWS_OBJECT_URL,
        url
    });
}

exports.getPlates = async (req, res) => {
    try { 

        const url = req.originalUrl;

        const token = req.headers.cookie.split('=')[1]
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.id, (user)=>{
            if(user){
                console.log(`User retrieved: ${user}`)
            }
        });
        
        res.status(200).render('index', {
            title: 'My Plates',
            plates:user.plates,
            env: process.env.NODE_ENV,
            aws_url: process.env.AWS_OBJECT_URL,
            url
        });

    } catch(err) {
        console.log(`Something went wrong: ${err}`)
    }

}

exports.createPlate = (req, res) => {

    const url = req.originalUrl;

    res.status(200).render('index', {
        title: 'Create Plate',
        env: process.env.NODE_ENV,
        aws_url: process.env.AWS_OBJECT_URL,
        url
    });
}


exports.getWeek = async (req, res) => {
    const url = req.originalUrl;
    const token = req.headers.cookie.split('=')[1]
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id, (user)=>{
        if(user){
            console.log(`User retrieved: ${user.name}`)
        }
    });
        
    res.status(200).render('index', {
        title: 'My Week',
        week: user.week,
        env: process.env.NODE_ENV,
        aws_url: process.env.AWS_OBJECT_URL,
        url
    });
}

exports.getPlateDetail = async (req, res, next) => {
    
    try {

        const url = req.originalUrl;
        const plateid = req.params.id;

        const plate = await Plate.findById(req.params.id);

        res.status(200).render('index', {
            title: 'Plate Detail',
            plate: plate,
            plateid,
            env: process.env.NODE_ENV,
            aws_url: process.env.AWS_OBJECT_URL,
            url
        });
        
    } catch (err) {
        console.log(err);
        // res.status(404).json({
        //     status: 'fail',
        //     error: err,
        //     message: err.message
        // });

        //pass error to global error handler
        next(err);
    }
}

exports.updatePlate = async (req, res) => {

    const url = req.originalUrl;
    const plateid = req.params.id;
    const plate = await Plate.findById(req.params.id);


    try {
        res.status(200).render('index', {
            title: 'Update Plate',
            plate: plate,
            plateid,
            env: process.env.NODE_ENV,
            aws_url: process.env.AWS_OBJECT_URL,
            url
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
        const url = req.originalUrl;
        const token = req.headers.cookie.split('=')[1]
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id, (user)=>{
            if(user){
                console.log(`User retrieved: ${user.name}`)
            }
        });
    
        res.status(200).render('index', {
            title: 'My Account',
            user: user,
            env: process.env.NODE_ENV,
            aws_url: process.env.AWS_OBJECT_URL,
            url
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
        const url = req.originalUrl;

        res.status(200).render('index', {
            env: process.env.NODE_ENV,
            aws_url: process.env.AWS_OBJECT_URL,
            url
        });

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Error 💥 rendering update password template..', err
        });
    }
}