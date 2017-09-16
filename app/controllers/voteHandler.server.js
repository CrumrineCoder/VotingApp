'use strict';
/*
  This file can find the poll, and if it doesn't, make the poll on the request. This file also handles updating the database
*/
//var MongoClient = require('mongodb').MongoClient;
/*
function voteHandler (db) {
  console.log("voteHandler up");

  console.log(db);
  // Get the 'votes' collection

   var votes = db.collection('votes');
  // Make a new method 'getvotes'
   this.getvotes = function (req, res) {
       console.log("get votes up");
     // No need for an id yet, we will need those for when we're allowed to make polls however
      var voteProjection = { '_id': false };
     // Inside the collection, find the first thing. Will need to change this when there is more than one poll
      votes.findOne({}, voteProjection, function (err, result) {
         if (err) {
            throw err;
         }
        // If there is a result, return it
         if (result) {
            res.json(result);
         } else {
           // If there is no result, make a new poll. Will need to change this functionality later. 
            votes.insert({ 'Yes': 0, 'No': 0 }, function (err) {
               if (err) {
                  throw err;
               }
              // Now that it's made, NOW find it
               votes.findOne({}, voteProjection, function (err, doc) {
                  if (err) {
                     throw err;
                  }
                  res.json(doc);
               });
            });
         }
      });
   };
// Vote on the poll 
 // var clientSideVariables = require(process.cwd() + '/controllers/voteController.client.js'); 
   this.addvote = function (req, res) {
       console.log("add votes up");
     var results = req.query.data;
         votes.findAndModify({}, { '_id': 1 }, { $inc: { [results]: 1 }}, function (err, result) {
         if (err) {
            throw err;
         }
         res.json(result);
      });
      
   }; 

  
}

module.exports = voteHandler;
