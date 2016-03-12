var mongoose = require('mongoose');

var monsterSchema =  new mongoose.Schema ({
  heroClass: { type: String,  default: '' },
  monsterClass: { type: String, default: ''},
  blabla: { type: String, default: ''},
  yyy: { type: String, default: ''}
});

module.exports = mongoose.model('monsters', monsterSchema);

