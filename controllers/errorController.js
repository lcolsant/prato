module.exports = (err, req, res, next) => {
    
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';



const sendErrorDev = (err, res) => {

    //logging full error information
    console.log(err);
    
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    });
}
const sendErrorProd = (err, res) => {
    //check if user, operational, error before sending message to client; else server error 500; send generic message
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
        //programming or other unknown error
    } else {

        console.log('ERROR 💥 ', err);

        res.status(500).json({
            status: 'error',
            message: '💥 Something went very wrong!'
        });
    }
}


    //send back more detailed error messages if in development

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.send.NODE_ENV === 'production') {
        sendErrorProd(err,res);
    }
};