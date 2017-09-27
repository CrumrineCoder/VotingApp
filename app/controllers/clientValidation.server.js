'use strict';
var https = require('https');

function validationHandler() {
    this.validateCaptcha = function(req, res) {
        console.log("Validate Captcha Running");
        var secret = process.env.SECRET;
        var response = req.query.response;
        var ip = req.query.ip;
        var apiCall = " https://www.google.com/recaptcha/api/siteverify?secret=" + secret + "&response=" + response + "&remoteip=" + ip;
        https.get(apiCall, function callback(response) {

            var body = '';
            var i = 0;
            response.on('data', function(chunk) {
                i++;
                body += chunk;

            });
            response.on('end', function() {
                console.log(JSON.parse(body)["success"]);
            });

            //  ajaxRequest('POST', apiCall, function() {});
        })
    }
}

module.exports = validationHandler;