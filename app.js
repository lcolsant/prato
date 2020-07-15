const express = require('express');
const path = require('path');


landingRouter = require('./routes/landingRoutes')
plateRouter = require('./routes/plateRoutes')

const app = express()
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', landingRouter);
app.use('/api/v1/plates', plateRouter);


module.exports = app;

