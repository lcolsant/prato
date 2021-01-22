const AppError = require('./../utils/appError');

//handle invalid path url
const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`
    console.log(message);
    return new AppError(message, 404);

};

// handle duplicate login name
const handleDuplicateFieldsDB = err => {
    const message = `A user with ${err.keyValue.email} already exists.`;
    return new AppError(message, 404);
};

const handleValidationErrorDB = err => {
    //iterate over errors property of err object and pull out the message property and save as 'errors' array
    const errors = Object.values(err.errors).map(el => el.message);
    //join all error messages
    const message = `Invalid input data: ${errors.join('. ')}`;
    return new AppError(message, 404);
};



//send back more detailed error messages in development environment
const sendErrorDev = (err, req, res) => {
    console.log('in sendErrorDev');
    //logging full error information
            
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}


const sendErrorProd = (err, req, res) => {
    console.log('in sendErrorProd');

    //check if user, operational, error before sending message to client; else server error 500; send generic message
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
        //programming or other unknown error
    } else {

        console.log('ERROR 💥 ', err);

        res.status(500).json({
            status: 'error',
            message: '💥 Something went wrong!'
        });
    }
}

module.exports = (err, req, res, next) => {
    
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // send back more detailed error messages if in development
    if (process.env.NODE_ENV === 'development') {
        let error = { ...err, name:err.name, message:err.message };
        
        console.log(process.env.NODE_ENV)
   

        if(error.name === 'CastError') error = handleCastErrorDB(error);
        if(error.code === 11000) error = handleDuplicateFieldsDB(error);
        if(error.name === 'ValidationError') error = handleValidationErrorDB(error);
        
        sendErrorDev(error, req, res);

    }
    
    if (process.env.NODE_ENV === 'production') {
        let error = { ...err, name:err.name, message:err.message };

        console.log(process.env.NODE_ENV)

        if(error.name === 'CastError') error = handleCastErrorDB(error);
        if(error.code === 11000) error = handleDuplicateFieldsDB(error);
        if(error.name === 'ValidationError') error = handleValidationErrorDB(error);

        
        sendErrorProd(error,req, res);
    }
};
