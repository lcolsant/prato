const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// const appError = require('./utils/appError');


viewsRouter = require('./routes/viewRoutes')
plateRouter = require('./routes/plateRoutes')
userRouter = require('./routes/userRoutes')

const app = express()

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// app.set('port', process.env.PORT || 3000)


//app.use(bodyParser.urlencoded({extended:true}));

//app.use(express.static(path.join(__dirname)));
app.use('/public', express.static(path.join(__dirname,'public')));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use('/', viewsRouter);
app.use('/api/v1/plates', plateRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req,res,next)=> {
    res.status(404).json(`Can't find ${req.originalUrl} on this server!`)
});


//app.use(appError);
// app.use((err, req, res, next) => {
    
//     err.statusCode = err.statusCode || 500;
//     err.status = err.status || 'error';

//     res.status(err.statusCode).json({
//         status: err.status,
//         message: err.message
//     });
// });


module.exports = app;

