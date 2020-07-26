const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');


landingRouter = require('./routes/landingRoutes')
plateRouter = require('./routes/plateRoutes')
userRouter = require('./routes/userRoutes')

const app = express()
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use('/', landingRouter);
app.use('/api/v1/plates', plateRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req,res,next)=>{

    res.status(404).json(`Can't find ${req.originalUrl} on this server!`)
});


module.exports = app;

