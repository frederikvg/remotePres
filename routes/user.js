exports.list = function (req, res) {
    res.send("respond with a resource");
};

var mongoose = require('mongoose');

var UserDetail = new mongoose.Schema({
    username: String,
    password: String,
    email: String
}, {collection: 'userInfo'});

module.exports = mongoose.model('Users', UserDetail);