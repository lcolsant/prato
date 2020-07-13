const express = require('express');

const router = express.Router()


router.get('/', (req, res) => {res.send('Prato server up and running!')});
    

module.exports = router;
