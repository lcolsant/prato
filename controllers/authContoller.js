const jwt = require('jsonwebtoken');
const User = require('../models/userModel');




exports.signup = async (req, res) => {
    
    console.log(req.body);
    
    try {
    
        const newUser = await User.create(req.body);


        res.status(201).json({
            status:'sucess',
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