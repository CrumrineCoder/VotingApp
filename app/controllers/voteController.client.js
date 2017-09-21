//'use strict';
/*
This file handles adding votes to a poll as well as displaying the data to the user. 
It adds an event listener to the vote button to update the poll, and everytime the event happens the pie chart is also updated.
The pie chart is updated on first loading the page as well. 
*/
window.onload = function() {



    //var poll = document.querySelector('.poll');
    var result = null;
    //var voteNbr = document.querySelector('#vote-nbr');
    var apiUrl = 'https://joinordie.glitch.me/';
    //Used to have :vote? on the end of apiUrl, might need it again

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
        // Add a link to the voting page for each of these once they're set up
        for (var i = 0; i < pollObject.length; i++) {
            listings.innerHTML += "<form action='" + apiUrl + "polls/view/" + i + "' method='get'>" + "<button type='submit'>" + pollObject[i].question + "</button>" + "<br>" + "</form>";

        }

    }

    var path = window.location.pathname;
    var page = path.split("/").pop();

    function showVotingOptions(data) {

        var question = document.getElementById('question');
        var replies = document.getElementById('responses');
        var votingButton = document.getElementById('votingButton');
        votingButton.innerHTML =  "<form action='" + apiUrl + "polls/view/" + page + "/results' method='get'>" + "<button type='submit'> Vote </button>" + "<br>" + "</form>";
        var pollObject = JSON.parse(data);
        question.innerHTML = pollObject[page].question;

        votingButton.addEventListener('click', function() {
            // Check if a radio is checked

            result = document.querySelector('input[name= "reply"]:checked').value;
            console.log(result);
            // Make a post request to change the votes, and then a get request to update the browser side
           ajaxRequest('POST', "https://joinordie.glitch.me/api/:vote?data=" + result + "&question=" + pollObject[page].question, function() {
   
               // ajaxRequest('GET', apiUrl + "/polls/view/" + page +"/results", updatevoteCount);

           });
        }, false);

        for (var key in pollObject[page]) {
            if (key != 'question') {
                var value = key;
                // Make this into a proper form
              //   <label><input type="radio" value="Yes" name="question">Yes</label>
   
                replies.innerHTML += "<label><input type='radio' value = '" + value +"' name='reply'>"+value+"</label>";
                replies.innerHTML += "<br>";
            }
        }
    }


    //Results page
    function updatevoteCount(data) {
        var number = path.split("/")[3];


        var pollObject = JSON.parse(data);
        pollObject = pollObject[number];
        var keys = [],
            values = [];
        for (var i in pollObject) {
            keys.push(i);
            values.push(pollObject[i]);
        }

        //Remove question from the results
        keys.shift();
        values.shift();

        var ctx = document.getElementById("chart").getContext('2d');
        var myChart = new Chart(ctx, {
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
    }
    if (page == "view") {
        ready(ajaxRequest('GET', apiUrl + "api/listings", showQuestions));
    } else if (!isNaN(page)) {
        ready(ajaxRequest('GET', apiUrl + "api/listings", showVotingOptions));
    } else if (page == "results") {
        ready(ajaxRequest('GET', apiUrl + "api/listings", updatevoteCount));
    }
};