'use strict';
/* Authentication: */

var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');

//mongoose.connect('mongodb://' + process.env.HOST + '/' + process.env.NAME);
//var db = mongoose.connection;

var users = require('./app/routes/users.js');
/*
  This file handles connecting the user to the server and the controllers to the database. 
*/
var express = require('express'),
	routes = require('./app/routes/index.js'),
	mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient; 
var mLab = 'mongodb://' + process.env.HOST + '/' + process.env.NAME;
var app = express();
 


/* For Authentication 
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');

//app.use('/api', routesApi);
//require(process.cwd() + '/models/db');
//require(process.cwd()+ '/config/passport.js'); 
app.use(passport.initialize());
*/ 

// Taken from: https://www.youtube.com/watch?v=Z1ktxiqyiLA
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/public', express.static(process.cwd() + '/public'));

app.use(session({
    secret: process.env.PASSKEY,
    saveUninitialized: true,
    resave: true
}));

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(flash());

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use('/', routes);
   app.use('/users', users);
	app.listen(3000, function () {
	 	console.log('Listening on port 3000...');
	});

/*
MongoClient.connect(mLab, function (err, db) {

	if (err) {
		throw new Error('Database failed to connect!');
	} else {
		console.log('MongoDB successfully connected on port 27017.');
	}

//	app.use('/public', express.static(process.cwd() + '/public'));
	app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
//Exports the routes to app and db
//	routes(app, db);
  
  
  


});*/