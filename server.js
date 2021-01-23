express = require('express');

require('dotenv').config();

//handle synchronous erros (e.g. using undefined variables)
process.on('uncaughtException', err => {
    console.log('Uncaught Exception.💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 3000

//localhost development db
//mongoose.connect('mongodb://localhost/prato', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

//production db - MongoDB Atlas
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4g8pi.mongodb.net/prato?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
//Depracation warning: Use MongoDB driver's findOneAndUpdate() rather than findAndModify(); https://mongoosejs.com/docs/deprecations.html#findandmodify
mongoose.set('useFindAndModify', false);


mongoose.connection.on('connected', ()=>console.log('Connected to MongoDB...'));


const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});

//handle asynchronous errors outside of express (e.g. mongoDB connection error). close server (allow tasks to finish) and then shut down app
process.on('unhandledRejection', err => {
    console.log('Unhandled Rejection.💥 Shutting down...');
    console.log(err.name, err.message);
    server.close( () => {
        process.exit(1);
    });
});






