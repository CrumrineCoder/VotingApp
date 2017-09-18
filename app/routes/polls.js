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

    var question = req.body.question;
    var answer = req.body.answer;
    var answer2 = req.body.answer2;


    // Validation
    req.checkBody('question', 'Question is required').notEmpty();
    req.checkBody('answer', 'At least two answers are required').notEmpty();
    req.checkBody('answer2', 'At least two answers are required').notEmpty();
    // I might need more validation, but I believe I'll only require these validations and the rest of things that are added are optional, which means I don't need to check them

    var errors = req.validationErrors();
    if (errors) {
        res.render('create', {
            errors: errors
        });
    } else {
        var newPoll= new Poll({
            question: question,
            answer: answer,
            answer2: answer2
        });
        Poll.createPoll(newPoll, function(err, Poll) {
            if (err) throw err;
            console.log(Poll);
        });

        req.flash('success_msg', 'Your poll was created.');

       res.redirect('/');
    }
});

module.exports = router;