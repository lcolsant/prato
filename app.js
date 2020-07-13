const express = require('express');
const path = require('path');


landingRouter = require('./routes/landingRoutes')

const app = express()
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', landingRouter);


module.exports = app;

