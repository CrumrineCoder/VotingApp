var express = require('express');
var router = express.Router();
//var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;

var Poll = require(process.cwd() + '/models/poll');

router.get('/create', function(req, res) {

    res.render('create');
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
    if (errors) {
        res.render('create', {
            errors: errors
        });
    } else {
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