var mongoose = require('mongoose');

var slideSchema = new mongoose.Schema({
    slidetitle: { type: String, default: '' },
    slidecontent: { type: String, default: '' },
    video: { type: String, default: '' },
    image: { type: String, default: '' },
    background: { type: String, default: '' },
    code: { type: String, default: '' }
}, {_id: false});

var presSchema =  new mongoose.Schema({
    presentatie: String,
    maker: String,
    created: { type: Date, default: Date.now },
    slides: [slideSchema]
}, {_id: false});

module.exports = mongoose.model('User', {
	id: String,
	username: String,
	password: String,
	email: String,
	firstName: String,
	lastName: String,
    presentaties: [presSchema]
});