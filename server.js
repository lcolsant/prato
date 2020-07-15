//express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./app');

const port = process.env.PORT || 3000

//localhost development db
mongoose.connect('mongodb://localhost/prato', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

const db = mongoose.connection;

db.on('error', ()=> {
    console.log('MongoDB connection error...')
});

db.once('open', ()=> {
    console.log('Connected to MongoDB...')
});


app.listen(port, () => {
    console.log(`server running on port ${port}`);
})

