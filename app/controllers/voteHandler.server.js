'use strict';
// This file gets the polls collection data from the db and handles adding votes to the database
function voteHandler(db) {
    //
    // Get the 'polls' collection
    // Send the collection in a function
    var polls = db.collection('polls');

    this.checkExistance = function(req, res) {
        polls.find({
            question: req.query.question
        }, {
            $exists: true
        }).toArray(function(err, doc) //find if a value exists
            {
                if (err) throw err
                if (doc && doc.length) //if it does
                {
                    res.json(doc); // print out what it sends back
                } else // if it does not 
                {
                    res.json("Not in docs");
                }
            });

    }
    // get all polls
    this.getPolls = function(req, res) {
        polls.find({}, {
            __v: 0
        }).toArray(function(err, documents) {
            if (err) throw err
            res.json(documents);
        })
    }
    // Vote on the poll 
    this.addvote = function(req, res) {
        var results = req.query.data;
              results = results.split(",");
        console.log("Results: " + results);
        if (results != undefined) {

            if (!Array.isArray(results)) {
                console.log("Not an Array");
                polls.findAndModify({
                    question: req.query.question
                }, {
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
            } else {
                console.log("Is an Array");
        
                for (var i = 0; i < results.length; i++) {
                    polls.findAndModify({
                        question: req.query.question
                    }, {
                        '_id': 1
                    }, {

                        $inc: {
                            [results[i]]: 1
                        }

                    });
                }
              polls.find({question: req.query.question}, function(err, result) {
                        if (err) {
                            throw err;
                        }
                        res.json(result);
                    });
            }
        }
    };
    this.rescindVote = function(req, res) {
        var results = req.query.data;

        if (results != undefined) {
            results = results.split(",");
            if (!Array.isArray(results)) {
                polls.findAndModify({
                    question: req.query.question
                }, {
                    '_id': 1
                }, {

                    $inc: {
                        [results]: -1
                    }

                });
              var toBeRemoved;
                 polls.find({
                        question: req.query.question
                    }, {
                        [results]: 1,
                        _id: 0
                    }).forEach(function(item) {
                        if (item[results] < 1) {
                           if(results.includes("[User Answer]")){
                            toBeRemoved = item;
                           }
                  
                        }
                    }, function(err, result) {
                    if (err) {
                        throw err;
                    }
                    res.json(result);
                });  
              
              if(toBeRemoved != null){
                 polls.update({
                            question: req.query.question
                        }, {
                            $unset: {
                                [Object.keys(toBeRemoved)]: 1
                            }
                        });
              }
            } else {
                var toBeRemoved = [];
                
                function getEmptyValues(i, max, callback) {
                    polls.find({
                        question: req.query.question
                    }, {
                        [results[i]]: 1,
                        _id: 0
                    }).forEach(function(item) {
                        if (item[results] < 1) {
                           if(results[i].includes("[User Answer]")){
                            toBeRemoved.push(item);
                           }
                           if(i+1 >= max){
                             callback();
                            }
                        }
                    }, function(err, result) {
                    if (err) {
                        throw err;
                    }
                    res.json(result);
                });            
                }

                function removeEmptyUserAnswers() {
                    for (var i = 0; i < toBeRemoved.length; i++) {
                        polls.update({
                            question: req.query.question
                        }, {
                            $unset: {
                                [Object.keys(toBeRemoved[i])]: 1
                            }
                        });
                    }
                }

                function decrement() {
                    for (var i = 0; i < results.length; i++) {
                        polls.findAndModify({
                            question: req.query.question
                        }, {
                            '_id': 1
                        }, {

                            $inc: {
                                [results[i]]: -1
                            }

                        });
                        getEmptyValues(i, results.length, removeEmptyUserAnswers);
                    }
               
                }
              decrement();    
            }
        }
    }
    this.addVoter = function(req, res) {
        var user = req.query.IP;
        polls.findAndModify({
            question: req.query.question
        }, {
            '_id': 1
        }, {

            $push: {
                IP: user
            }

        }, function(err, result) {
            if (err) {
                throw err;
            }
            res.json(result);
        });
    }
    this.removeVoter = function(req, res) {
        var user = req.query.IP;
        polls.findAndModify({
            question: req.query.question
        }, {
            '_id': 1
        }, {

            $pull: {
                IP: user
            }

        }, function(err, result) {
            if (err) {
                throw err;
            }
            res.json(result);
        });
    }

    this.searchPolls = function(req, res) {
        var searchTerm = req.query.searchTerm;
        polls.find({
            $text: {
                $search: "  " + searchTerm + " "
            }
        }, {
            __v: 0
        }).toArray(function(err, documents) {
            if (err) throw err
            res.json(documents);
        })
    }

    this.searchPollsByUser = function(req, res) {
        var user = req.user["username"];
        polls.find({
            user: user
        }, {
            _v: 0
        }).toArray(function(err, documents) {
            if (err) throw err
            res.json(documents);
        })
    }
}

module.exports = voteHandler;