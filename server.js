
'use strict';
/* Authentication: */
/*
  This file handles connecting the user to the server and the controllers to the database. 
*/
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Connecte to the database with Mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://' + process.env.HOST + '/' + process.env.NAME, {
    useMongoClient: true
});
var db = mongoose.connection;
// Get the other routes
var polls = require('./app/routes/polls.js');
var users = require('./app/routes/users.js');
var express = require('express'),
    routes = require('./app/routes/index.js'),
    mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var mLab = 'mongodb://' + process.env.HOST + '/' + process.env.NAME;
var app = express();

// Set up the view engine, handlebars
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
    defaultLayout: 'layout'
}));
app.set('view engine', 'handlebars');

// Parsers for cookies and body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

// Shortcut the other directories
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/views', express.static(process.cwd() + '/views'));

// Passport session
app.use(session({
    secret: process.env.PASSKEY,
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));

// Bodyparser validation
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));
// Error message formatting
app.use(flash());

app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Routing
app.use('/users', users);
app.use('/polls', polls);
// Connect to the database with MongoDB
MongoClient.connect(mLab, function(err, db) {
 
    if (err) {
        throw new Error('Database failed to connect!');
    } else {
      //  console.log('MongoDB successfully connected on port 27017.');
    }
 
    //Exports the routes to app and db
    routes(app, db);
    app.listen(3000, function() {
    //    console.log('Listening on port 3000...');
    });
});