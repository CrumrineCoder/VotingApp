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

     // Ready and ajaxRequest are used to make requests to the backend.
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

     // showQuestions shows the polls when the user clicks 'View Polls' on the navigation bar.
     function showQuestions(data) {
         var listings = document.getElementById('anchor');
         var pollObject = JSON.parse(data);

         var number;
         if (pollObject.length != 0) {
             listings.innerHTML = "";
             for (var i = 0; i < pollObject.length; i++) {
                 number = 0;
                 for (var key in pollObject[i]) {
                     if (!isNaN(parseInt(pollObject[i][key])) && key != "_id" && key != "IP" && key != "question" && key != "Position") {
                         number += pollObject[i][key];
                     }
                 }
                 listings.innerHTML += "<form action='" + apiUrl + "polls/view/" + pollObject[i].Position + "' method='get'>" + "<button type='submit' style='width: 75%;'>" + pollObject[i].question + "<div class='smallNumber'>" + number + "</div> </button>" + "<br>" + "</form>";
             }
         }
     }

     // showUserQuestions shows the poll that a user has created when they go to their dashboard.
     function showUserQuestions(data) {
         var user;
         var listings = document.getElementById('anchor');
         var number;
         var pollObject = JSON.parse(data);

         // getUser gets the user's username and gets all polls that has the user's username.
         function getUser(callback) {
             ajaxRequest('GET', apiUrl + "users/user_data", function(data) {
                 data = JSON.parse(data);
                 if (data.hasOwnProperty('username')) {
                     user = data.username;
                 }
                 callback();
             });
         }

         // After getUser, this function shows all of the polls that the user has created 
         getUser(function() {
             if (pollObject[0].user == user) {

                 if (pollObject.length != 0) {
                     listings.innerHTML = "";
                     for (var i = 0; i < pollObject.length; i++) {
                         number = 0;
                         for (var key in pollObject[i]) {
                             if (!isNaN(parseInt(pollObject[i][key])) && key != "_id" && key != "IP" && key != 'question' && key != "Position") {
                                 number += pollObject[i][key];
                             }
                         }
                         listings.innerHTML += "<form action='" + apiUrl + "polls/edit/" + pollObject[i].Position + "' method='get'>" + "<button style='width:75%;' type='submit'>" + pollObject[i].question + "<div class='smallNumber'>" + number + "</div> </button>" + "<br>" + "</form>";
                     }
                 }

             } else {
                 listings.innerHTML = "Your account does not have access to edit this poll."
             }
         });
     }

     // These are used to determine what page the user is on.
     var path = window.location.pathname;
     var page = path.split("/").pop();

     // When a poll is clicked on, this function runs; this function shows the user what options they have and handles form submission to the poll.
     function showVotingOptions(data) {

         var question = document.getElementById('question');
         var replies = document.getElementById('responses');
         var votingButton = document.getElementById('votingButton');

         var pollObject = JSON.parse(data);

         // Error handling
         if (Object.keys(pollObject).length < page) {
             votingButton.innerHTML = "We could not find a poll by that numerical value. 404, and such."
         } else {

             // If the user has not already voted on this poll (represented by storing their IP and checking inf it's there)
             if (!pollObject[page].IP.includes(ip)) {

                 // Go to the results of the page
                 function seeResults() {
                     window.location.replace(apiUrl + "polls/view/" + page + "/results");
                 }

                 var status = document.getElementById("status");
                 // Showing the options the poll creator made to the user that depends on how many choices the user can make and whether they can see the results before voting
                 if (pollObject[page]["Options"].includes("Change") && pollObject[page]["Options"].includes("SeeResults")) {

                     status.innerHTML = "You will  be able to recind your vote and see the results before voting."
                     document.getElementById("results").innerHTML = "<Button>Results</Button>";
                     document.getElementById("results").addEventListener('click', seeResults, false);

                 } else if (pollObject[page]["Options"].includes("Change")) {
                     status.innerHTML = "You will be able to recind your vote, but you cannot see the results before doing so.";
                 } else if (pollObject[page]["Options"].includes("SeeResults")) {
                     status.innerHTML = "You will be able to see the results of the poll before voting, but you cannot recind your vote.";
                     document.getElementById("results").innerHTML = "<Button>Results</Button>";
                     document.getElementById("results").addEventListener('click', seeResults, false);
                 } else {
                     status.innerHTML = "You will not be able to recind your vote or see the results before voting.";
                 }
                 // If the 'Multiple' option has been selected, have all the user replies be checkboxes to allow for multiple answers, otherwise use radios

                 if (pollObject[page]["Options"].includes("Captcha")) {

                     // If the poll creator enabled Captcha, then this happens
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

                 // If the poll creator allows for multiple replies, make the form options checkboxes, else they're radios (change is in how they react to multiple being selected)
                 if (pollObject[page]["Options"].includes("Multiple")) {
                     var votingOption = "checkbox";
                 } else {
                     var votingOption = "radio";
                 }
                 // Format Question
                 question.innerHTML = pollObject[page].question;

                 // If the 'Open' option has been selected, allow the user to select the radio/checkbox and make their own value. The placeholder will change with the user's choice.

                 if (pollObject[page]["Options"].includes("OpenAnswers")) {

                     document.getElementById("openRadio").innerHTML = "<input id='OpenAnswer' type=" + votingOption + " value = '" + value + "' name='reply' class='vis-hidden voteButton'/><label class='voteButton' for='OpenAnswer'> <span id='placeholder'>Write your own answer here. </span></label>"

                     document.getElementById("openRadio").innerHTML += "<br>";
                     document.getElementById('OpenAnswer').onclick = function() {
                         var answer = prompt("Please enter your answer:");
                         if (answer == null || answer == "") {
                             answer = "User cancelled the prompt.";
                         } else {
                             document.getElementById('OpenAnswer').value = answer;
                             document.getElementById('placeholder').innerHTML = answer;
                         }
                     };
                 }
                 // Format the rest of the replies
                 for (var key in pollObject[page]) {
                     if (key != 'question' && key != "user" && key != "_id" && key != "Options" && key != "IP" && key != "Position") {
                         var value = key;
                         replies.innerHTML += "<input id='" + value + "' type=" + votingOption + " value = '" + value + "' name='reply' class='vis-hidden voteButton'/><label class='voteButton' for='" + value + "'>" + value + "</label>"
                         replies.innerHTML += "<br>";
                     }
                 }
                 // Make the buttons to complete the form visible after all of this stuff is loaded
                 document.getElementById("makeVisible").style.visibility = "visible";

                 // On finishing the form...
                 votingButton.addEventListener('click', function(e) {

                     ajaxRequest('GET', "https://joinordie.glitch.me/api/addVoter/?IP=" + ip + "&question=" + pollObject[page].question, function() {});
                     // Captcha verification
                     if (pollObject[page]["Options"].includes("Captcha") && !captchaFinished) {
                         // If Captch is required but not filled out

                         e.preventDefault();
                         grecaptcha.execute();
                     } else if (document.querySelector('input[name= "reply"]:checked').value == null) {
                         // If there is nothing checked

                         e.preventDefault();

                     } else {
                         // storing the data
                         result = document.querySelector('input[name= "reply"]:checked').value;

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
                         } else {
                             if (!Object.hasOwnProperty.call(pollObject[page], result)) {
                                 result = "[User Answer] " + result;
                             }
                         }
                         localStorage.setItem("question", pollObject[page].question);
                         localStorage.setItem("result", result);

                         // Make a post request to change the votes, and then a get request to update the browser side
                         ajaxRequest('POST', "https://joinordie.glitch.me/api/vote/?data=" + result + "&question=" + pollObject[page].question, function() {});
                         window.location.replace(apiUrl + "polls/view/" + page + "/results");
                     }
                 }, false);

             } else {
                 // Error message for voting on the same poll and show them to the results page

                 window.location.replace(apiUrl + "polls/view/" + page + "/results");
             }

         }
     }

     //Results page
     function updatevoteCount(data) {
         var number = path.split("/")[3];
         var pollObject = JSON.parse(data);

         pollObject = pollObject[number];
         if (pollObject.IP.includes(ip) || pollObject.Options.includes("SeeResults")) {
             if (localStorage.getItem("question") == pollObject.question && pollObject["Options"].includes("Change")) {

                 document.getElementById("rescind").addEventListener('click', function(e) {

                     ajaxRequest('POST', "https://joinordie.glitch.me/api/rescind/?data=" + localStorage.getItem("result") + "&question=" + localStorage.getItem("question"), function() {
                         ajaxRequest('GET', "https://joinordie.glitch.me/api/removeVoter/?IP=" + ip + "&question=" + localStorage.getItem("question"), function() {
                             window.location.replace(apiUrl + "polls/view/" + number + "?");
                             localStorage.clear();
                         });
                     });
                 });
             } else {
                 document.getElementById("rescind").innerHTML = "";
             }
             document.getElementById('pollQuestion').innerHTML = "<p> " + pollObject.question + " </p>";
             // We don't want these to show up on the poll results page.
             delete pollObject.IP;
             delete pollObject.Options;
             delete pollObject.question;
             delete pollObject._id;
             delete pollObject.user;
             delete pollObject.Position;

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

             var totalVotesHTML = document.getElementById("totalVotes");
             var sum = values.reduce(function(a, b) {
                 return a + b;
             }, 0);
             totalVotesHTML.innerHTML = "<p> Total Votes: " + sum + " </p>";

             var ctx = document.getElementById("bar").getContext('2d');
             var options = {
                 scales: {
                     xAxes: [{
                         ticks: {
                             beginAtZero: true
                         }
                     }]
                 },
                 responsive: false,
                 legend: {
                     display: false
                 }
             }
             var colors = [
                 "#2ecc71",
                 "#3498db",
                 "#95a5a6",
                 "#9b59b6",
                 "#f1c40f",
                 "#e74c3c",
                 "#34495e",
                 "#4ABDAC",
                 "#F7B733",
                 "#007849",
                 "#COB283",
                 "#EEAA7B",
                 "#A239CA",
                 "#4717F6",
                 "#0E0B16",
                 "#6D7993",
                 "#062F4F",
                 "#3CC47C",
                 "#1E392A",
                 "#FEDCD2",
                 "#49274A",
                 "#0B3C5D",
                 "#88D317"
             ]
             var bar = new Chart(ctx, {
                 type: 'horizontalBar',
                 options,
                 data: {
                     labels: keys,
                     datasets: [{
                         backgroundColor: colors,
                         data: values
                     }]
                 }
             });
             var ctx = document.getElementById("pie").getContext('2d');
             var pie = new Chart(ctx, {
                 type: 'pie',
                 data: {
                     labels: keys,
                     datasets: [{
                         backgroundColor: colors,
                         data: values
                     }]

                 },
                 options: {
                     responsive: false
                 }
             });
             if (document.getElementById("rescind").innerHTML !== "") {
                 document.getElementById("makeVisible").style.visibility = "visible";
             }
         } else {
             // Error handling to be done

             window.location.replace(apiUrl + "polls/view/" + number + "?/");
         }
     }

     function editPoll(data) {
         var pollObject = JSON.parse(data);

         // Display the question

         var input = document.createElement('input');
         input.type = 'hidden';
         input.value = pollObject[page].question;
         input.name = 'question';
         var firstQuestion = document.getElementsByClassName('questionContainer')[0];

         firstQuestion.appendChild(input);

         var input = document.createElement('input');
         input.type = 'hidden';
         input.value = pollObject[page].question;
         input.name = 'question';
         var secondQuestion = document.getElementsByClassName('questionContainer')[1];
         secondQuestion.appendChild(input);

         var input = document.createElement('input');
         input.type = 'hidden';
         input.value = pollObject[page].Position;
         input.name = "Position";
         firstQuestion.appendChild(input);

         var input = document.createElement('input');
         input.type = 'hidden';
         input.value = pollObject[page].Position;
         input.name = "Position";
         secondQuestion.appendChild(input);
         var question = document.getElementById('writeQuestion');
         // insertAfter(question, input);
         // insertAfter(document.getElementsByClassName('questionStorage')[0], input);
         question.innerHTML = pollObject[page].question;

         //   document.getElementById('writeQuestion').innerHTML = "<input type='text' value=' " + pollObject[page].question + "' readonly name='question' id='question' placeholder='Question: " + pollObject[page].question + "' style='font-size:20px; width: 100%; padding: 5px 0px 0px 0px;' > </input>";
         //    document.getElementsByClassName('questionStorage')[0].outerHTML = "<input type='hidden' value= '" + pollObject[page].question + "' name='question'/>"
         // Display the already made answers

         var completedAnswers = document.getElementById('alreadyDoneAnswers');
         for (var key in pollObject[page]) {
             if (key != 'question' && key != "user" && key != "_id" && key != "Options" && key != "IP" && key != "Position") {
                 var value = key;
                 completedAnswers.innerHTML += "<input id='" + value.trim() + "' type= 'checkbox' value = '" + value.trim() + "' name='reply'  checked class='vis-hidden' /> <label class='voteButton' for='" + value.trim() + "'>" + value + "</label>"
                 completedAnswers.innerHTML += "<br>";

             }
         }
         //document.getElementById("question").setAttribute('size', document.getElementById("question").getAttribute('placeholder').length);
         for (var i = 0; i < pollObject[page]["Options"].length; i++) {
             document.getElementById(pollObject[page]["Options"][i]).checked = true;
         }

         function checkEditPollReplies(callback) {
             var replies = 0;
             var question = document.getElementById('writeQuestion');
             $('input').each(function() {

                 // Check for already made answers
                 if ($(this).attr('name') == 'reply' && $(this).is(":checked")) {
                     replies++;
                 }
                 // Check for new answers
                 else if ($(this).val() != '' && $(this).attr('name') != 'question' && $(this).attr('name') != 'searchTerm' && $(this).attr('type') == 'text') {
                     replies++;
                 }
             });
             if (replies < 2) {
                 $('.submitButton').addClass('disabled');
                 $('.submitButton').attr('disabled', 'disabled'); // updated according to http://stackoverflow.com/questions/7637790/how-to-remove-disabled-attribute-with-jquery-ie
             } else {
                 $('.submitButton').removeClass('disabled');
                 $('.submitButton').removeAttr('disabled'); // updated according to http://stackoverflow.com/questions/7637790/how-to-remove-disabled-attribute-with-jquery-ie
             }
         }

         checkEditPollReplies();
         $('input:not(#findPolls)').change(checkEditPollReplies);
         $(document).on("change", "input[name='reply']", checkEditPollReplies);
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