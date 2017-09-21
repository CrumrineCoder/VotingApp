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

  
    // Get the 'votes' collection
    var votes = db.collection('votes');
    // Make a new method 'getvotes'
    this.getvotes = function(req, res) {
        // No need for an id yet, we will need those for when we're allowed to make polls however
        var voteProjection = {
            '_id': false
        };
        // Inside the collection, find the first thing. Will need to change this when there is more than one poll
        votes.findOne({}, voteProjection, function(err, result) {
            if (err) {
                throw err;
            }
            // If there is a result, return it
            if (result) {
                res.json(result);
            } else {
                // If there is no result, make a new poll. Will need to change this functionality later. 
                votes.insert({
                    'Yes': 0,
                    'No': 0
                }, function(err) {
                    if (err) {
                        throw err;
                    }
                    // Now that it's made, NOW find it
                    votes.findOne({}, voteProjection, function(err, doc) {
                        if (err) {
                            throw err;
                        }
                        res.json(doc);
                    });
                });
            }
        });
    };
   
}

module.exports = voteHandler;