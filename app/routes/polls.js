
var express = require('express');
var router = express.Router();
// This file handles routing relation to making and viewing polls
//var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;
var Poll = require(process.cwd() + '/models/poll');
//var page; 
router.get('/create', function(req, res) {
    res.render('create');
});

router.get('/view', function(req, res) {
    res.render('pollListings');
});

router.post('/search/', function(req, res) {
  res.render(process.cwd() + '/views/pollListings.handlebars');
});

router.get('/view/:id', function(req, res){
   res.render('vote');
});

router.get('/view/:id/results', function(req, res){
 // TODO: Validation for if the user has not voted
   res.render('result');
});

// Create poll
router.post('/create', function(req, res) {
  var numberOfOptions = 0; 
  var errors = [];
  if(Object.hasOwnProperty.call(req.body, "user")){
    req.body.user = req.user.username;
  };
    for (var key in req.body) {
      if(req.body[key] != '' && key!='question' && key!='user' && key!="Open" && key!="Multiple" && key!="Captcha" && key != "IP" && key != "Change" && key != "SeeResults"){
        numberOfOptions++;
      }  
      if(key=='question' && req.body[key] == ''){
        errors.push({msg:'Question is required'});
      }
    }   
    if(numberOfOptions < 2){
      errors.push({msg: 'At least two answers are required'});
    } 
    if (errors.length != 0 && errors.length != undefined) {
        res.render('create', {
            errors: errors
        });
       errors = [];
    } else {
       for (var key in req.body) {
           if(req.body[key] == ''){
             delete req.body[key];
           }
        }
        var parsed={Options: []};
        for(var key in req.body){
          if(key != 'question' && key!='user' && key!="Open" && key!="Multiple" && key!="Captcha" && key != "IP" && key != "Change" && key != "SeeResults"){
          parsed[req.body[key]] = 0;
          }
          else if(key != 'question' && ( key=="Open" || key =="Multiple"||key=="Captcha"||key=="Change"||key=="SeeResults")){
            parsed["Options"].push(req.body[key])
          }
          else if(key=="question"){
            parsed["question"] = req.body[key];
          }
          else{
            parsed["user"] = req.body[key];
          }
        }
        var newPoll= new Poll(parsed);
        Poll.createPoll(newPoll, function(err, Poll) {
            if (err) throw err;
        //    console.log(Poll);
        });

        req.flash('success_msg', 'Your poll was created.');

       res.redirect('/polls/view');
    }
});

router.get('/edit/:id', function(req, res) {
  if(req.user){
      res.render('edit');
  }
  else{
    res.render('login');
  }
});

router.post('/edit/', function(req, res) {
 var numberOfOptions;
  var errors = [];
  //console.log(req.body);
/*  if(Object.hasOwnProperty.call(req.body, "user")){
    req.body.user = req.user.username;
  }; */

    for (var i=0; i<req.body["reply"].length; i++) {
      req.body["addedAnswer" + i] = req.body["reply"][i];
    }
   delete req.body["reply"];

    for (var key in req.body) {
      if(req.body[key] != '' && key!='question' && key!='user'  && key != "IP" && key != "Options"){
        numberOfOptions++;
      }  
      if(key=='question' && req.body[key] == ''){
        errors.push({msg:'Question is required'});
      }
    }   
    if(numberOfOptions < 2){
      errors.push({msg: 'At least two answers are required'});
    } 
    if (errors.length != 0 && errors.length != undefined) {
        res.render('edit', {
            errors: errors
        });
       errors = [];
    } else {
       for (var key in req.body) {
           if(req.body[key] == ''){
             delete req.body[key];
           }
        }
        var parsed={Options: []};
        for(var key in req.body){
          if(key != 'question' && key!='user' && key!="Open" && key!="Multiple" && key!="Captcha" && key != "IP" && key != "Change" && key != "SeeResults"){
          parsed[req.body[key]] = 0;
          }
          else if(key != 'question' && ( key=="Open" || key =="Multiple"||key=="Captcha"||key=="Change"||key=="SeeResults")){
            parsed["Options"].push(req.body[key])
          }
          else if(key=="question"){
            parsed["question"] = req.body[key];
          }
          else{
            parsed["user"] = req.user.username;
          }
        }
      // console.log(parsed);
        var newPoll= new Poll(parsed);
        Poll.replace(newPoll, function(err, Poll) {
           if (err) throw err;
      //     console.log(Poll);
       });
      //  Poll.createPoll(newPoll, function(err, Poll) {
        //    if (err) throw err;
            //console.log(Poll);
      //  });

        req.flash('success_msg', 'Changes Saved.');

       res.redirect('/polls/view');
    } 
});

router.post("/delete", function(req,res){

  var newPoll = new Poll(req.body);
  Poll.delete(newPoll, function(err, Poll){
    if(err) throw err; 
  })
  req.flash('success_msg', 'Poll Deleted :(');

  res.redirect('/polls/create');
  // Get the identityCounters collection and decrease the counter by 1
  // Connect to the database, get the polls collection, find the poll in question, and delete the document.
});

module.exports = router;