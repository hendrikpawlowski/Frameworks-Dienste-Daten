const express = require('express');
const app = express();
const datenbank = require('./datenbank');


app.get('/', (req, res) => {

    res.status(200).json({
        daten: datenbank
    })
});

module.exports = app;