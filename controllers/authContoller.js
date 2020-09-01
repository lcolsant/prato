const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { promisify } = require('util');



// const signToken = id => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN
//     });
// }

//Secure cookie option will be set to true in production
const cookieOptions = {
    'expires': new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    'httpOnly': true,
    'secure': true,
    'X-Forwarded-Proto': 'https',
    // secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
};

// const createSendToken = (user, statusCode, req, res) => {
//     const token = signToken(user._id);
    
//     res.cookie('jwt', token, {
//         expires: new Date(
//             Date.now() + process.env.JWT_EXPIRES_IN * 21 * 60 * 60 * 1000
//         ),
//         httpOnly: true,
//         secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
//     });
// };
    
//     user.password = undefined;
    
//     res.status(201).json({
//         status:'success',
//         token,
//         data:{
//             message: 'Created a new user successfully!',
//             data: newUser,
//         }
//     });
// }


exports.signup = async (req, res) => {
    
    //console.log(req.body);
    
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

        
        if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;

        //Send cookie with JWT
        res.cookie('jwt', token, cookieOptions);

        //Set password to undefined so that it doesn't appear in response
        newUser.password = undefined;

        res.status(201).json({
            status:'success',
            token,
            data:{
                message: 'Created a new user successfully!',
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

exports.login = async (req, res, next) => {
    const { email, password } = req.body

    console.log(`from auth controller...${email}...${password}`)

    //check if email and password exist
    if(!email || !password) {
        return next(new Error('Please provide email and password!'));
             
    }

    //const user = User.findOne({email: email});
    //ES6

    //append password field (as set not to show by default in User model schema)
    const user = await User.findOne({email}).select('+password');
    
    //Password compare here....
    console.log(user);
    if(!user || !(await user.correctPassword(password, user.password))){
        //console.log(password);
        //console.log(user.password);
        return next(new Error('Incorrect email or password'));
    }

    //send token
    const token = jwt.sign( {id: user._id} , process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });;

    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    //send cookie
    res.cookie('jwt', token, cookieOptions);
    
    res.status(200).json({
        status: 'success',
        token
    });
}

exports.logout = (req, res) => {
    
    console.log('hit logged out route');

    res.cookie('jwt', 'logged out', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};


exports.protect = async (req, res, next) => {
    let token;
    let decoded;
    //console.log(req.headers.authorization);       
    
    // 1) Getting token from req.headers
    try {
        if(!req.headers.authorization && !req.headers.authorization.startsWith('Bearer')) {
            throw new Error(err);
        };
        
        token = req.headers.authorization.split(' ')[1];
        console.log(`token passed: ${token}`);

    } catch(err) {
     
        if(!token) {
            return next(new Error('You must be logged in to access this route.'));
        }
    }

    // 2) Verify and decode token using jwt.verify function

    try {
        decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //    console.log(decoded);

    } catch (err) {
        if(err.name === 'TokenExpiredError') {
            return next(new Error('Your token has expired. Please log in again.'));
        }
        
        return next(new Error('Invalid token. Please log in again.'));
    }

    // 3) Check if user still exists
    console.log(decoded);
    const currentUser = await User.findById(decoded.id);
    console.log(currentUser);
    
    if(!currentUser) {
        return next(new Error('The user belonging to the token no longer exists.'))
    }

    // 4)  Check if user changed password after the token was issued

    if(currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new Error('User recently changed password. Please log in again.'))
    };

    req.user = currentUser;
    //Grant access to protected route
    next();
}