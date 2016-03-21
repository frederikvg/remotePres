var mongoose = require('mongoose');

var slideSchema = new mongoose.Schema({
    slidetitle: { type: String, default: '' },
    slidecontent: { type: String, default: '' }
}, {_id: false});

var presSchema =  new mongoose.Schema({
    presentatie: String,
    slides: [slideSchema]
});

module.exports = mongoose.model('Slide', presSchema);

