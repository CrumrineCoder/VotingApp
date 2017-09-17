

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var PollSchema = mongoose.Schema({
	question: {
		type: String,
		index:true
	},
	answer: {
		type: String
	}
});

var Poll = module.exports = mongoose.model('Poll', PollSchema);

module.exports.createPoll = function(newPoll, callback){
  newPoll.save(callback);
	/*bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});*/
}

module.exports.getPollByQuestion = function(question, callback){
	var query = {question: question};
	Poll.findOne(query, callback);
}

module.exports.getPollById = function(id, callback){
	Poll.findById(id, callback);
}
/*
module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
*/