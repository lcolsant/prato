const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

// const createSendToken = (user, statusCode, req, res) => {
//     const token = signToken(user._id);
    
//     res.cookie('jwt', token, {
//         expires: new Date(
//             Date.now() + process.env.JWT_EXPIRES_IN * 21 * 60 * 60 * 1000
//         ),
//         httpOnly: true,
//         secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
//     });
    
    
//     user.password = undefined;
    
//     res.status(201).json({
//         status:'sucess',
//         token,
//         data:{
//             message: 'Created a new user sucessfully!',
//             data: newUser,
//         }
//     });
// }


exports.signup = async (req, res) => {
    
    console.log(req.body);
    
    try {
    
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
        });


        const token = jwt.sign( {id: newUser._id} , process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        //createSendToken(newUser, 201, req, res);

        res.status(201).json({
            status:'sucess',
            token,
            data:{
                message: 'Created a new user sucessfully!',
                data: newUser,
            }
        });

    } catch (err){
        res.status(404).json({
            status: 'fail',
            message: 'Error 💥 saving to MongoDB..', err
        });
    }

}