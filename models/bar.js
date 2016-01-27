var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate')
var schema = mongoose.Schema({
    githubId: String,
    barId: String,
});
schema.plugin(findOrCreate);
var Bar = mongoose.model('Bar', schema);

module.exports = Bar;