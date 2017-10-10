
'use strict';
// This file handles the home route along with the API routes
var VoteHandler = require(process.cwd() + '/app/controllers/voteHandler.server.js');
var ValidationHandler = require(process.cwd() + "/app/controllers/clientValidation.server.js");
module.exports = function(app, db) {

    // Creates an object from the server controller
    var voteHandler = new VoteHandler(db);
    var validationHandler = new ValidationHandler();
    // If routed here and there's a get method, send the index.html file
    // Later probably redirect to the poll create page first
    app.route('/')
        .get(function(req, res) {
            res.render(process.cwd() + '/views/create.handlebars');
        });
    // If routed here and there's a get or post method, do these  things  inside of the server file
    app.route('/api/listings')
      .get(voteHandler.getPolls)
    app.route('/api/vote/?')
  //      .get(voteHandler.getvotes)
        .post(voteHandler.addvote)
    app.route('/api/rescind/?')
        .post(voteHandler.rescindVote);
    app.route('/api/search/?')
      .get(voteHandler.searchPolls)
    app.route('/api/userSearch/')
      .get(voteHandler.searchPollsByUser)
   app.route('/api/addVoter/?')
      .get(voteHandler.addVoter)
   app.route('/api/removeVoter/?')
      .get(voteHandler.removeVoter)
    app.route('/api/validate/?')
      .get(validationHandler.validateCaptcha)
    
};