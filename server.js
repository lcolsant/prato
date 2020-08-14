express = require('express');
// const path = require('path');

//const dotenv = require('dotenv')
require('dotenv').config();
const mongoose = require('mongoose');
// const http = require('http');

//livereload code here
// const livereload = require('livereload');
// const server = livereload.createServer({
    //     'exts': [ html, ejs, css ]
// });

// server.watch([__dirname + '/public', __dirname + '/views']);

const app = require('./app');

const port = process.env.PORT || 3000


//localhost development db
//mongoose.connect('mongodb://localhost/prato', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

//production db - MongoDB Atlas
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4g8pi.mongodb.net/prato?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
//Depracation warning: Use MongoDB driver's findOneAndUpdate() rather than findAndModify(); https://mongoosejs.com/docs/deprecations.html#findandmodify
mongoose.set('useFindAndModify', false);


mongoose.connection.on('connected', ()=>console.log('Connected to MongoDB...'));


app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});

// const server = http.createServer(app);
// server.listen(app.get('port'), () => console.log('Server listening on port ' + app.get('port') ));




