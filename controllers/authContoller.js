const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { promisify } = require('util');
// const sendEmail = require('../utils/email');
const Email = require('../utils/email');
const AppError = require('../utils/appError');


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


exports.signup = async (req, res, next) => {
    
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

        // Send welcome email

        //use code below for non-class based email option
        // await sendEmail({
        //     email: req.body.email,
        //     name: req.body.name.split(" ")[0],
        //     subject: 'Welcome to Prato!',
        //     type: 'welcome'
        // });
        
        const url = `${req.protocol}://${req.get('host')}`

        await new Email(newUser, url).sendWelcome();

        res.status(201).json({
            status:'success',
            token,
            data:{
                message: 'Created a new user successfully!',
                data: newUser,
            }
        });

    } catch (err){
        // res.status(500).json({
        //     status: 'error',
        //     error: err,
        //     message: `Error 💥: ${err.message}`
        //     // message: err
        // });
        // return next(new AppError(err.message,500));
        return next(err);

    }

}

exports.login = async (req, res, next) => {
    const { email, password } = req.body

    // console.log(`from auth controller...${email}...${password}`)

    //check if email and password exist
    if(!email || !password) {
        return next(new AppError('Please provide email and password!',401));
             
    }

    //const user = User.findOne({email: email});
    //ES6

    //append password field (as set not to show by default in User model schema)
    const user = await User.findOne({email}).select('+password');
    
    //Password compare here....
    // console.log(user);
    if(!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError('Incorrect email or password',401));
    }

    //send token
    const token = jwt.sign( {id: user._id} , process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });;

    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    //send cookie
    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;
    res.locals.user = user;
    
    res.status(200).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
}

exports.logout = (req, res) => {
    
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};


exports.protect = async (req, res, next) => {
    let token;
    let decoded;
    // console.log(`Req.headers.cookie: ${req.headers.cookie}`)

    // 1) Getting token from req.headers
    try {
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            
            // console.log('No req auth...')
            // throw new Error(err);
        }else if (req.headers.cookie){
            token = req.headers.cookie.split('=')[1];
        };
        
    
        // console.log(`token passed: ${token}`);

    } catch(err) {
     
        if(!token) {
            console.log('Error: No auth token passed. You must be logged in to access this route!')
            return next(new Error('You must be logged in to access this route.'));

            // res.redirect('/');
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
    // console.log(decoded);
    const currentUser = await User.findById(decoded.id);
    // console.log(currentUser);
    
    if(!currentUser) {
        return next(new Error('The user belonging to the token no longer exists.'))
    }

    // 4)  Check if user changed password after the token was issued

    if(currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new Error('User recently changed password. Please log in again.'))
    };

    //Grant access to protected route
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
}

// only for rendered pages
exports.isLoggedIn = async (req, res, next) => {
    if (req.headers.cookie) {
      try {
        // 1) verify token

        // console.log(`isLoggedIn token: ${req.headers.cookie.split('=')[1]}`)
        const decoded = await promisify(jwt.verify)(
            req.headers.cookie.split('=')[1],
            process.env.JWT_SECRET
        );
  
        // 2) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
          return next();
        }
  
        // 3) Check if user changed password after the token was issued
        if (currentUser.changedPasswordAfter(decoded.iat)) {
          return next();
        }
  
        // THERE IS A LOGGED IN USER
        res.locals.user = currentUser;
        return next();
      } catch (err) {
        return next();
      }
    }
    next();
  };

  exports.updatePassword = async (req, res) => {
    
    try {

        const user = await User.findById(req.user.id).select('+password');

        if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
            return next(new Error('Your current password is wrong.'));
        }

        user.password = req.body.newPassword;
        user.passwordConfirm = req.body.passwordConfirm;
        await user.save();


        //send token
        const token = jwt.sign( {id: user._id} , process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });;

        if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;

        //send cookie
        res.cookie('jwt', token, cookieOptions);

        user.password = undefined;
        res.locals.user = user;
        
        res.status(200).json({
            status: 'success',
            token,
            data: {
                user
            }
        });
        
    } catch (error) {
        console.log('error updating password');
        console.log(error);
        
    }
    
    
  }