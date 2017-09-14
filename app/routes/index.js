'use strict';
/*
This file handles redirecting API calls to the controllers
*/
var express = require('express');
var router = express.Router();

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/index');
	}
}

var VoteHandler = require(process.cwd() + '/app/controllers/voteHandler.server.js');
//var RegisterHandler = require(process.cwd())

module.exports = function (app, db) {
// Creates an object from the server controller
   var voteHandler = new VoteHandler(db);
  // var registerHandler = new RegisterHandler(db);
// If routed here and there's a get method, send the index.html file
   app.route('/')
      .get(function (req, res) {
         res.sendFile(process.cwd() + '/public/index.html');
      });
// If routed here and there's a get or post method, do these  things  inside of the server file
   app.route('/api/:vote?')
      .get(voteHandler.getvotes)
      .post(voteHandler.addvote)
};


/*
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/index');
	}
}

var VoteHandler = require(process.cwd() + '/app/controllers/voteHandler.server.js');

var voteHandler = new VoteHandler();

//var app = express();

router.get('/api/:vote?', function(req, res){
  console.log("SHIPPOW");
  res.send(voteHandler.getvotes);
});
router.post('/api/:vote?', function(req, res){
  console.log("SHIPPOW1");
  res.send(voteHandler.addvote);
});
//app.route('/api/:vote?')
   //   .get(voteHandler.getvotes)
  //    .post(voteHandler.addvote)

module.exports = router;

*/
