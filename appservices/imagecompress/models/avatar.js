const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const avatarSchema = new Schema({
    userID: Schema.Types.ObjectId,
    base64Avatar: String,
});

// const avatar = new mongoose.model('avatar', avatarSchema);
const avatar = mongoose.model('avatar', avatarSchema);

module.exports = avatar;