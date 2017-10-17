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
}, {
    strict: false
});

PollSchema.index({
    question: 'text'
});
PollSchema.plugin(autoIncrement.plugin, {
    model: 'Poll',
    startAt: 0
});
var Poll = module.exports = mongoose.model('Poll', PollSchema);

module.exports.createPoll = function(newPoll, callback) {

      newPoll.save(callback);

}
var polls = db.collection('polls');
var counter = db.collection('identitycounters');
module.exports.replace = function(newPoll, callback) {
    polls.replaceOne({
        $text: {
            $search: '\"' + newPoll.question + '\"'
        }
    }, newPoll);
}
    var Position = db.collection('Position');
module.exports.delete = function(poll, callback) {
    // Get the id of the question
    var position;
    polls.find({
        question: poll.question
    }).forEach(function(item) {
        position = item._id;
        decrement(position);
    });

   Position.update({}, {
        $inc: {
            Position: -1,
        }
    });

  
    console.log("Delete");
    polls.deleteOne({
        question: poll.question
    });
    console.log("Update Count");
    counter.update({}, {
        $inc: {
            "count": -1
        }
    }, function(err, results) {
        if (err) {
            throw err
        }
        if (!results.length) {
            //   console.log("not found");
        }
    });
    // Get every document with an ID larger than it and decrement it { qty: { $gt: 4 } } 
    function decrement(id) {
        console.log("ID: " + id)
        polls.findAndModify({
            _id: {
                $gt: id
            }
        }, {
            '_id': 1
        }, {

            $inc: {
                Position: -1
            }

        })
    }

}

module.exports.checkExistance = function(poll, res, callback) {

    polls.find({
        question: poll.question
    }, {
        $exists: true
    }).toArray(function(err, doc) //find if a value exists
        {
            if (doc && doc.length) //if it does
            {
                return callback(null, doc); // print out what it sends back
            } else // if it does not 
            {
                return callback(null, "Not in docs");
            }
        });
}