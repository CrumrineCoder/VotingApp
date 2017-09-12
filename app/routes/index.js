'use strict';
/*
This file handles redirecting API calls to the controllers
*/
var VoteHandler = require(process.cwd() + '/app/controllers/voteHandler.server.js');
//var RegisterHandler = require(process.cwd())

module.exports = function (app, db) {
// Creates an object from the server controller
   var voteHandler = new VoteHandler(db);
  // var registerHandler = new RegisterHandler(db);
// If routed here and there's a get method, send the index.html file
   app.route('/')
      //res.render('index')
      .get(function (req, res) {
         res.sendFile(process.cwd() + '/public/index.html');
      });
// If routed here and there's a get or post method, do these  things  inside of the server file
   app.route('/api/:vote?')
      .get(voteHandler.getvotes)
      .post(voteHandler.addvote)
   
  /*
  app.route('/register')
     .post(registerHandler.verifyData)
  */
};
