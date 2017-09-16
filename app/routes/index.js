'use strict';
/*
This file handles redirecting API calls to the controllers
*/
var VoteHandler = require(process.cwd() + '/app/controllers/voteHandler.server.js');
module.exports = function(app, db) {

    // Creates an object from the server controller
    var voteHandler = new VoteHandler(db);

    // If routed here and there's a get method, send the index.html file
    app.route('/')
        .get(function(req, res) {
            res.render(process.cwd() + '/views/index.handlebars');
        });
    // If routed here and there's a get or post method, do these  things  inside of the server file
    console.log('api.route("api:vote?")');
    app.route('/api/:vote?')
        .get(voteHandler.getvotes)
        .post(voteHandler.addvote)
};