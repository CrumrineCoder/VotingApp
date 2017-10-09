// This file handles the backend for the poll mongoose schema

var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');;
var bcrypt = require('bcryptjs');
mongoose.connect('mongodb://' + process.env.HOST + '/' + process.env.NAME, {
    useMongoClient: true
});
var db = mongoose.connection;
autoIncrement.initialize(db);
// User Schema
var PollSchema = mongoose.Schema({
  IP: [String],
  Options: [String],
  user: {
    type: String
  },
	question: {
		type: String,
		index:true
	}/*,
	answer: {
		type: String
	},
  answer2:{
    type: String
  }*/
}, {strict: false});
  
PollSchema.index({question:'text'});
PollSchema.plugin(autoIncrement.plugin, {model: 'Poll', startAt: 0});
var Poll = module.exports = mongoose.model('Poll', PollSchema);

module.exports.createPoll = function(newPoll, callback){
  newPoll.save(callback);
}
var polls = db.collection('polls');
var counter = db.collection('identitycounters');
module.exports.replace = function(newPoll, callback){
  
  polls.replaceOne(
    
    { $text: { $search: newPoll.question} }, newPoll
  );
}

module.exports.delete = function(poll, callback){
  polls.deleteOne( { question: poll.question } );
  counter.update({}, { $inc: { "count": -1 }  }, function (err, results) {
    if (err) { throw err }
    if (!results.length) {
        console.log("not found");
    }
  });
}

/*
module.exports.getPollByQuestion = function(question, callback){
	var query = {question: question};
	Poll.findOne(query, callback);
}

module.exports.getPollById = function(id, callback){
	Poll.findById(id, callback);
}
*/
/*
module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
*/