
const { plates } = require('../dev-data/data/plates-dev');
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

exports.getPlates = (req, res) => {
    console.log(plates.length)
    
    res.status(200).render('plates', {
        title: 'My Plates',
        plates:plates
    });
}

exports.createPlate = (req, res) => {
    console.log('in create plate');

    res.status(200).render('createPlate', {
        title: 'Create Plate',
    });
}