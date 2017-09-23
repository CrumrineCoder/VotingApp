'use strict';
// This file gets the polls collection data from the db and handles adding votes to the database
function voteHandler(db) {

    // Get the 'polls' collection
    // Send the collection in a function
   var polls = db.collection('polls');
   this.getPolls = function(req,res){
     polls.find({}, {_id: 0, __v:0}).toArray(function(err,documents){
       if(err) throw err
       res.json(documents);
     })     
   }
     // Vote on the poll 
    this.addvote = function(req, res) {
        var results = req.query.data;
        polls.findAndModify({ question: req.query.question }, {
            '_id': 1
        }, {
            $inc: {
                [results]: 1
            }
        }, function(err, result) {
            if (err) {
                throw err;
            }
            res.json(result);
        });

    };   
}

module.exports = voteHandler;