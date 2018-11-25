const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 7000
const avatar = require('./models/avatar.js');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/userimages', { useNewUrlParser: true })
    .catch(err => {
        throw err;
    });


 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


/**
 * We should consider pasring the images into base64 
 * before we even push it to the server.
 */

/**
 * Get base64 encoding of user image.
 */
app.get('/image/:userid', (req, res) => {
    res.send({ base64Encoding: "Currently empty" });
});

/**
 * Create user image
 */
app.post('/image/new', (req, res) => {
    let body = req.body;

    avatar.create({
        userID: body.userID,
        base64Avatar: body.base64Avatar
    });

    res.send("Empty");
});

/**
 * Update user image
 */
app.put('/image/update', (req, res) => {
    res.send("Empty");
});

app.listen(PORT, () => {

    console.log(`Application running on ${PORT}`);

});