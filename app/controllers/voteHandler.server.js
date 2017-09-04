'use strict';

function voteHandler (db) {
   var votes = db.collection('votes');
   this.getvotes = function (req, res) {
      var voteProjection = { '_id': false };
      votes.findOne({}, voteProjection, function (err, result) {
         if (err) {
            throw err;
         }

         if (result) {
            res.json(result);
         } else {
            votes.insert({ 'votes': 0 }, function (err) {
               if (err) {
                  throw err;
               }

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

   this.addvote = function (req, res) {
      votes.findAndModify({}, { '_id': 1 }, { $inc: { 'votes': 1 }}, function (err, result) {
         if (err) {
            throw err;
         }
         res.json(result);
      });
   }; 

  
}

module.exports = voteHandler;
