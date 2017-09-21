var express = require('express');
var router = express.Router();
//var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;
var Poll = require(process.cwd() + '/models/poll');

router.get('/create', function(req, res) {
    res.render('create');
});

router.get('/view', function(req, res) {
    res.render('pollListings');
});

router.get('/view/:id', function(req, res){
  console.log(req.params.id); 
  // TODO: Validation for if the user already voted
   res.render('vote');
});

router.get('/view/:id/results', function(req, res){
 // TODO: Validation for if the user has not voted
   res.render('vote');
});

// Create poll
router.post('/create', function(req, res) {
  var numberOfOptions = 0; 
  var errors = [];
    for (var key in req.body) {
      if(req.body[key] != '' && key!='question'){
        numberOfOptions++;
      }  
      if(key=='question' && req.body[key] == ''){
        errors.push({msg:'Question is required'});
      }
    }   
    if(numberOfOptions < 2){
      errors.push({msg: 'At least two answers are required'});
    } 
    if (errors.arrayLength != 0 && errors.arrayLength != undefined) {
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
        var newPoll= new Poll(req.body);
        Poll.createPoll(newPoll, function(err, Poll) {
            if (err) throw err;
            //console.log(Poll);
        });

        req.flash('success_msg', 'Your poll was created.');

       res.redirect('/');
    }
});

module.exports = router;