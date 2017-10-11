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
		type: String
	}
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
    { $text: { $search: '\"'+ newPoll.question + '\"'} }, newPoll
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
