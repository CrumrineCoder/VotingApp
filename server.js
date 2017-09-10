'use strict';

var express = require('express'),
	routes = require('./app/routes/index.js'),
	mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient; 
var mLab = 'mongodb://' + process.env.HOST + '/' + process.env.NAME;
var app = express();

MongoClient.connect(mLab, function (err, db) {

	if (err) {
		throw new Error('Database failed to connect!');
	} else {
		console.log('MongoDB successfully connected on port 27017.');
	}

	app.use('/public', express.static(process.cwd() + '/public'));
	app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

	routes(app, db);

	app.listen(3000, function () {
	 	console.log('Listening on port 3000...');
	});

});