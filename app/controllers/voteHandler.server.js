'use strict';
// This file gets the polls collection data from the db and handles adding votes to the database
function voteHandler(db) {
//
    // Get the 'polls' collection
    // Send the collection in a function
   var polls = db.collection('polls');
  
  // get all polls
   this.getPolls = function(req,res){
     polls.find({}, {__v:0}).toArray(function(err,documents){
       if(err) throw err
       res.json(documents);
     })     
   }
     // Vote on the poll 
    this.addvote = function(req, res) {
        var results = req.query.data;
      if (results != undefined){
        results = results.split(",");
      if(!Array.isArray(results)){
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
      }
      else{
       for(var i=0; i<results.length; i++){
        polls.findAndModify({ question: req.query.question }, {
            '_id': 1
        }, {
             
              $inc: {
               [results[i]]: 1
              }  
            
        }, function(err, result) {
            if (err) {
                throw err;
            }
            res.json(result);
        });
       }
      }
      }
    };   
   this.addVoter = function(req, res) {
     var user = req.query.IP; 
      polls.findAndModify({ question: req.query.question }, {
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
   //find specific polls
 // console.log("Vote Handler Running");
    this.searchPolls = function(req,res){
      var searchTerm = req.query.searchTerm; 
      polls.find( { $text: { $search: "  "+searchTerm+" " } }, {__v:0} ).toArray(function(err,documents){
       if(err) throw err
         res.json(documents);
       })     
    }
    
    this.searchPollsByUser = function(req,res){
      var user = req.user["username"];
      polls.find({user: user}, {_v:0}).toArray(function(err, documents){
        if(err) throw err
        res.json(documents);
      })
      
      /*
      polls.find( { $text: { $search: "  "+searchTerm+" " } }, {__v:0} ).toArray(function(err,documents){
       if(err) throw err
         res.json(documents);
       })*/     
    }
}

module.exports = voteHandler;