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
            //console.log(Poll);
        });

        req.flash('success_msg', 'Your poll was created.');

       res.redirect('/polls/view');
    }
});

router.get('/edit/:id', function(req, res) {
    res.render('edit');
});

router.post('/edit/', function(req, res) {
  //var numberOfOptions = 0; 
  var errors = [];
  console.log(req.body);
  //req.body.user = req.user.name; 
  
  
  /*if(Object.hasOwnProperty.call(req.body, "user")){
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
        var parsed={};
        for(var key in req.body){
          if(key != 'question' && key!='user' && key!="Open" && key!="Multiple" && key!="Captcha" && key != "IP" && key != "Change" && key != "SeeResults"){
          parsed[req.body[key]] = 0;
          }
          else if(key== 'question'){
            parsed["question"] = req.body[key];
          }
          else if(key=="Open"){
            parsed["Open"] = req.body[key]
          }
          else if(key=="Multiple"){
            parsed["Multiple"] = req.body[key];
          }
          else if(key=="Captcha"){
            parsed["Captcha"] = req.body[key];
          }
          else if(key=="Change"){
            parsed["Change"] = req.body[key];
          }
          else if(key=="SeeResults"){
            parsed["SeeResults"] = req.body[key];
          }
          else{
            parsed["user"] = req.body[key];
          }
        }
        var newPoll= new Poll(parsed);
        Poll.createPoll(newPoll, function(err, Poll) {
            if (err) throw err;
            //console.log(Poll);
        });

        req.flash('success_msg', 'Changes Saved.');

       res.redirect('/polls/view');
    }*/
});

module.exports = router;