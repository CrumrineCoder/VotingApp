//'use strict';
// This file, onload, will handle the listing of polls, the listing of poll voting and event handling when clicked on one of those polls, and the showing of results when a poll is voted on using Chart.js
var ip;
var captchaFinished = false;

function getIP(json) {
    ip = json.ip;
}
window.onload = function() {

    var result = null;
    var apiUrl = 'https://joinordie.glitch.me/';

    function ready(fn) {
        // Will do the function once the document is ready
        if (typeof fn !== 'function') {
            return;
        }
        if (document.readyState === 'complete') {
            return fn();
        }
        document.addEventListener('DOMContentLoaded', fn, false);
    }

    function ajaxRequest(method, url, callback) {
        var xmlhttp = new XMLHttpRequest();
        // Everytime the readystage changes, we're checking if it's done, and if so this function will do the callback
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                callback(xmlhttp.response);
            }
        };
        xmlhttp.open(method, url, true);
        xmlhttp.send();
    }

    function showQuestions(data) {
        var listings = document.getElementById('anchor');
        var pollObject = JSON.parse(data);
        if (pollObject.length != 0) {
            listings.innerHTML = "";
            for (var i = 0; i < pollObject.length; i++) {
                listings.innerHTML += "<form action='" + apiUrl + "polls/view/" + pollObject[i]._id + "' method='get'>" + "<button type='submit'>" + pollObject[i].question + "</button>" + "<br>" + "</form>";
            }
        }
    }

    function showUserQuestions(data) {
        var user;
      var listings = document.getElementById('anchor');
      function getUser(callback){
        ajaxRequest('GET', apiUrl + "users/user_data", function(data) {
          data = JSON.parse(data);
           if (data.hasOwnProperty('username')) {
              user = data.username;
           }
           callback();
        });
      }

      getUser(function(){
       
        var pollObject = JSON.parse(data);

        if(pollObject[0].user == user){
         
        if (pollObject.length != 0) {
            listings.innerHTML = "";
            for (var i = 0; i < pollObject.length; i++) {
                listings.innerHTML += "<form action='" + apiUrl + "polls/edit/" + pollObject[i]._id + "' method='get'>" + "<button type='submit'>" + pollObject[i].question + "</button>" + "<br>" + "</form>";
            }
        }
        }
        else{
          listings.innerHTML = "Your account does not have access to edit this poll."
        }
      });
    }

    var path = window.location.pathname;
    var page = path.split("/").pop();

    function getOpenValue() {
        var txt;
        var answer = prompt("Please enter your answer:");
        if (answer == null || answer == "") {
            txt = "User cancelled the prompt.";
        } else {
            document.getElementById('open').value = txt;
        }
    }

    function showVotingOptions(data) {

        var question = document.getElementById('question');
        var replies = document.getElementById('responses');
        var votingButton = document.getElementById('votingButton');
        //    votingButton.innerHTML = "<form action='" + apiUrl + "polls/view/" + page + "/results' method='get'>" + "<button type='submit'> Vote </button>" + "<br>" + "</form>";
        // Get the Data
        var pollObject = JSON.parse(data);

        if (Object.keys(pollObject).length < page) {
            votingButton.innerHTML = "We could not find a poll by that numerical value. 404, and such."
        } else {
            if (!pollObject[page].IP.includes(ip) || pollObject[page]["Options"].includes("Change")) {

                function seeResults() {
                    window.location.replace(apiUrl + "polls/view/" + page + "/results");
                }
                var status = document.getElementById("status");
                if (pollObject[page]["Options"].includes("Change") && pollObject[page]["Options"].includes("SeeResults")) {

                    status.innerHTML = "You will  be able to vote more than once and to see the results before voting."
                    document.getElementById("results").innerHTML = "<Button>Results</Button>";
                    document.getElementById("results").addEventListener('click', seeResults, false);

                } else if (pollObject[page]["Options"].includes("Change")) {
                    status.innerHTML = "You will be able to vote more than once, but you cannot see the results before doing so.";
                } else if (pollObject[page]["Options"].includes("SeeResults")) {
                    status.innerHTML = "You will be able to see the results of the poll before voting, but you cannot vote more than once.";
                    document.getElementById("results").innerHTML = "<Button>Results</Button>";
                    document.getElementById("results").addEventListener('click', seeResults, false);
                } else {
                    status.innerHTML = "You will not be able to vote more than once or to see the results before voting.";
                }
                // If the 'Multiple' option has been selected, have all the user replies be checkboxes to allow for multiple answers, otherwise use radios

                if (pollObject[page]["Options"].includes("Captcha")) {
                    //var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;


                    var secret = "6LeXKjIUAAAAAJoaHILx2XTGAl9R0wtXmxypOqPN";
                    var captchaContainer = null;
                    var loadCaptcha = function() {
                        captchaContainer = grecaptcha.render('captcha_container', {
                            'sitekey': '6LeXKjIUAAAAAHPLmWex3-TJ4XEWgw3NDBUFyNvZ',
                            'callback': function(response) {
                                ajaxRequest('GET', apiUrl + "api/validate/?response=" + response + "&ip=" + ip, function(data) {
                                    captchaFinished = true;
                                });
                            }
                        });
                    };
                    loadCaptcha();
                }

                if (pollObject[page]["Options"].includes("Multiple")) {
                    var votingOption = "checkbox";
                } else {
                    var votingOption = "radio";
                }
                // Format Question
                question.innerHTML = pollObject[page].question;
                // If the 'Open' option has been selected, allow the user to select the radio/checkbox and make their own value. The placeholder will change with the user's choice.
                if (pollObject[page]["Options"].includes("Open")) {
                    document.getElementById("openRadio").innerHTML = "<label><input type=" + votingOption + " value = '' name='reply' id='open' /> <span id='placeholder'>Write your own answer here.</span></label>";
                    document.getElementById("openRadio").innerHTML += "<br>";
                    document.getElementById('open').onclick = function() {
                        var answer = prompt("Please enter your answer:");
                        if (answer == null || answer == "") {
                            answer = "User cancelled the prompt.";
                        } else {
                            document.getElementById('open').value = answer;
                            document.getElementById('placeholder').innerHTML = answer;
                        }
                    };
                }
                // Format the rest of the replies
                for (var key in pollObject[page]) {
                    if (key != 'question' && key != "user" && key != "_id" && key != "Options" && key != "IP") {
                        var value = key;
                        replies.innerHTML += "<label><input type=" + votingOption + " value = '" + value + "' name='reply' />" + value + "</label>"
                        replies.innerHTML += "<br>";
                    }
                }



                // On finishing the form
                votingButton.addEventListener('click', function(e) {
                  
                   
                    ajaxRequest('GET', "https://joinordie.glitch.me/api/addVoter/?IP=" + ip + "&question=" + pollObject[page].question, function() {});
                    if (pollObject[page]["Options"].includes("Captcha") && !captchaFinished) {
                        // If Captch is required but not filled out

                        e.preventDefault();
                        grecaptcha.execute();
                    } else if (document.querySelector('input[name= "reply"]:checked').value == null) {
                        // If there is nothing checked

                        e.preventDefault();

                    } else {

                        result = document.querySelector('input[name= "reply"]:checked').value;
                       localStorage.setItem("question", pollObject[page].question);
                       localStorage.setItem("result", result);
                        // Check if the user selected more than 1 checkbox
                        // If it's radios, it's not posible
                        if (votingOption != "radio") {
                            var checkboxes = document.getElementsByName('reply');
                            result = [];
                            for (var i = 0; i < checkboxes.length; i++) {
                                if (checkboxes[i].checked) {
                                    result.push(checkboxes[i].value);
                                }
                            }
                            // Check if the user made an option
                            if (!Object.hasOwnProperty.call(pollObject[page], result[0])) {
                                // If so, brand it
                                result[0] = "[User Answer] " + result[0];
                            }
                            // If the user selected one option, get rid of the array
                            if (result.length == 1) {
                                result = result[0];
                            }
                        }

                        // Make a post request to change the votes, and then a get request to update the browser side
                        ajaxRequest('POST', "https://joinordie.glitch.me/api/:vote?data=" + result + "&question=" + pollObject[page].question, function() {});
                        window.location.replace(apiUrl + "polls/view/" + page + "/results");
                    }
                }, false);

            } else {
                // Error message for voting on the same poll and show them to the results page
                console.log("YOU CANNOT VOTE ON THE SAME POLL TWICE SORRY FOR THE CAPS LOCK");
                window.location.replace(apiUrl + "polls/view/" + page + "/results");
            }

        }
    }

    //Results page
    function updatevoteCount(data) {
        var number = path.split("/")[3];
        var pollObject = JSON.parse(data);
        pollObject = pollObject[number];

        if (pollObject.IP.includes(ip) || Object.hasOwnProperty.call(pollObject, "SeeResults")) {
            console.log(localStorage.getItem("result"));
            console.log(localStorage.getItem("question"));
          
            if(localStorage.getItem("question") == pollObject.question){
              console.log("I never got over those blue eyes");
            }
            delete pollObject.IP;
            delete pollObject.Options;
            delete pollObject.question;
            delete pollObject._id;

            var datum = [];
            for (var i in pollObject) {
                datum.push([i, pollObject[i]]);
            }

            datum.sort(function(a, b) {
                return b[1] - a[1];
            });

            var keys = [],
                values = [];
            for (var i = 0; i < datum.length; i++) {
                keys.push(datum[i][0]);
                values.push(datum[i][1]);
            }

            var ctx = document.getElementById("pie").getContext('2d');
            var pie = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: keys,
                    datasets: [{
                        backgroundColor: [
                            //Add more colors later
                            "#2ecc71",
                            "#3498db",
                            "#95a5a6",
                            "#9b59b6",
                            "#f1c40f",
                            "#e74c3c",
                            "#34495e"
                        ],
                        data: values
                    }]
                }
            });
            var ctx = document.getElementById("bar").getContext('2d');
            var bar = new Chart(ctx, {
                type: 'horizontalBar',
                data: {
                    labels: keys,
                    datasets: [{
                        backgroundColor: [
                            //Add more colors later
                            "#2ecc71",
                            "#3498db",
                            "#95a5a6",
                            "#9b59b6",
                            "#f1c40f",
                            "#e74c3c",
                            "#34495e"
                        ],
                        data: values
                    }]
                }
            });
        } else {
            // Error handling to be done
            console.log("you must vote before seeing the results");
            window.location.replace(apiUrl + "polls/view/" + number + "?/");
        }
    }

    function editPoll(data) {
        var pollObject = JSON.parse(data);

        // Display the question
        document.getElementById('question').outerHTML = "<input type='text' value=' " + pollObject[page].question + "' readonly name='question' id='question' placeholder='Question: " + pollObject[page].question + "'> </input>";
        // Display the already made answers
        var completedAnswers = document.getElementById('alreadyDoneAnswers');
        for (var key in pollObject[page]) {
            if (key != 'question' && key != "user" && key != "_id" && key != "Options" && key != "IP") {
                var value = key;
                completedAnswers.innerHTML += "<label><input type= 'checkbox' value = '" + value + "' name='reply' checked />" + value + "</label>"
                completedAnswers.innerHTML += "<br>";
            }
        }
        //document.getElementById("question").setAttribute('size', document.getElementById("question").getAttribute('placeholder').length);
        for (var i = 0; i < pollObject[page]["Options"].length; i++) {
            document.getElementById(pollObject[page]["Options"][i]).checked = true;
        }
    }

    var searchTerm = document.getElementById("findPolls");
    var buttonToSubmit = document.getElementsByClassName("buttonToSubmit")[0];
    buttonToSubmit.addEventListener('click', function() {
        var searchText = searchTerm.value;
        localStorage.setItem("searchText", searchText);
    });
    if (page == "view") {
        ready(ajaxRequest('GET', apiUrl + "api/listings", showQuestions));
        // This is for the page being a number for the poll, the first poll ever made is poll '0', and so on
    } else if (path.split("/")[2] == "search") {
        ready(ajaxRequest('GET', apiUrl + "api/search/?searchTerm=" + localStorage.getItem("searchText"), showQuestions));
    } else if (page == "results") {
        ready(ajaxRequest('GET', apiUrl + "api/listings", updatevoteCount));
    } else if (page == "dashboard") {
        ready(ajaxRequest('GET', apiUrl + "api/userSearch/", showUserQuestions));
    } else if (path.split("/")[2] == "edit") {
        ready(ajaxRequest('GET', apiUrl + "api/listings/", editPoll));
    } else if (!isNaN(page) && page != "" && page != "create") {
        ready(ajaxRequest('GET', apiUrl + "api/listings", showVotingOptions));
    }

  
};