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
module.exports.replace = function(newPoll, callback){
  
  polls.replaceOne(
    
    { $text: { $search: newPoll.question} }, newPoll
  );

  
  
  
  /*for(var key in newPoll){
    var value = newPoll[key];
    polls.update(
     { $text: { $search: newPoll.question} }, {'$set' : { [key]: [value]}},  {strict: false}
     );
    
  }*/
  // polls.insert(
  //   { $text: { $search: newPoll.question} }, {newPoll},  {strict: false}
  //   );
 
  //polls.save(
    // { $text: { $search: newPoll.question} }, {newPoll}
  //);
  
  //newPoll.save(callback);
  
  /* // Empties the Object
  var id; 
  // get ID
  
   polls.find({ question: newPoll.question }, {
            '_id': 1
        },  function(err, result) {
            if (err) {
                throw err;
            }
           id = result["_id"]; 
        });
  console.log(id);
  //polls.remove(  { $text: { $search: newPoll.question} } );
  */
 // newPoll.save(callback)
  /*polls.replaceOne(
     { $text: { $search: newPoll.question} }, {}
  );
  
  for(var keys in newPoll){
    polls.update(
     { $text: { $search: newPoll.question} }, {'$set' : { [keys]: newPoll[keys]}},  {strict: false}
     );
  }*/
  //polls.replaceOne(
    // { $text: { $search: newPoll.question} }, {newPoll}
 // );
    /*
  newPoll,
  {upsert: true},
  function (err, doc) {
    polls.findOne({ $text: { $search: newPoll.question} }, {__v:0}, function (err, doc) {
        console.log(doc);
    });
  }
);*/
  //console.log("Katsup");
 // console.log(newPoll);
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