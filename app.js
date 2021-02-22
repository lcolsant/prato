const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const appError = require('./utils/appError');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const compression = require('compression');


const viewsRouter = require('./routes/viewRoutes')
const plateRouter = require('./routes/plateRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// app.set('port', process.env.PORT || 3000)


//app.use(bodyParser.urlencoded({extended:true}));

//app.use(express.static(path.join(__dirname)));
app.use(compression());
app.use('/public', express.static(path.join(__dirname,'public')));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use('/', viewsRouter);
app.use('/api/v1/plates', plateRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req,res,next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`,404));
});

//Global error handling middleware
app.use(globalErrorHandler);

console.log(`Environment: ${process.env.NODE_ENV}`);

module.exports = app;

