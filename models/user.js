var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate')
var schema = mongoose.Schema({
    githubId: String,
});
schema.plugin(findOrCreate);
var User = mongoose.model('User', schema);

module.exports = User;