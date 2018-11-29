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


app.get('/', (req, res) => {
    try {
        return res.json({ message: "Welcome to the image hosting platform" });
    }
    catch (err) {
        console.log(err);
        return res.json({ message: err });
    }
})


/**
 * We should consider pasring the images into base64 
 * before we even push it to the server.
 */

/**
 * Get base64 encoding of user image.
 */
app.get('/image/:userID', (req, res) => {

    try {
        avatar.findOne({ userID: req.params.userID }, (err, document) => {
            if (err) {
                return console.log(err)
            }
            // sends json with encoding in it.
            // return res.json({ base64Encoding: document.base64Avatar });
            return res.send(`<img src="${document.base64Avatar}"/>`);
        });
    }
    catch (err) {
        console.log(err);
        res.json({ message: err });
    }

});

/**
 * Create user image by id 
 */
app.post('/image/new', (req, res) => {
    let body = req.body;
    try {
        avatar.create({
            userID: body.userID,
            base64Avatar: body.base64Avatar
        });
        res.json({ message: "success" });
    }
    catch (err) {
        console.log(err);
        return res.json({ message: err });
    }
});

/**
 * Update user image by userid
 */
app.put('/image/update', (req, res) => {
    let body = req.body

    try {
        avatar.update({ userID: body.userID }, { userID: body.userID, base64Avatar: body.base64Avatar }, (err, doc) => {
            if (err) {
                console.log(err);
                return res.json({ message: err });
            }
            res.json({ message: "Updated successfully" });
        });
    } catch (err) {
        console.log(err);
        return res.json({ message: err });
    }
});

app.listen(PORT, () => {

    try {
        console.log(`Application running on ${PORT}`);
    }
    catch (err) {
        console.log(err);
    }

});