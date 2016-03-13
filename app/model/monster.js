var mongoose = require('mongoose');

var UserDetail = new mongoose.Schema({
    username: String,
    password: String
}, {collection: 'userInfo'});

module.exports = mongoose.model('userInfo', UserDetail);