//express = require('express');
//const dotenv = require('dotenv')
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const port = process.env.PORT || 3000


//localhost development db
//mongoose.connect('mongodb://localhost/prato', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

//production db - MongoDB Atlas
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4g8pi.mongodb.net/prato?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

// const db = mongoose.connection;

// db.on('error', ()=> {
//     console.log('MongoDB connection error...')
// });

// db.once('open', ()=> {
//     console.log('Connected to MongoDB...')
// });

mongoose.connection.on('connected', ()=>console.log('Connected to MongoDB...'));


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})

