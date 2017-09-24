//'use strict';
// This file, onload, will handle the listing of polls, the listing of poll voting and event handling when clicked on one of those polls, and the showing of results when a poll is voted on using Chart.js
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

    var path = window.location.pathname;
    var page = path.split("/").pop();

    function showVotingOptions(data) {
        var question = document.getElementById('question');
        var replies = document.getElementById('responses');
        var votingButton = document.getElementById('votingButton');
        votingButton.innerHTML = "<form action='" + apiUrl + "polls/view/" + page + "/results' method='get'>" + "<button type='submit'> Vote </button>" + "<br>" + "</form>";
        var pollObject = JSON.parse(data);
        question.innerHTML = pollObject[page].question;
        votingButton.addEventListener('click', function() {
            // Check if a radio is checked
            result = document.querySelector('input[name= "reply"]:checked').value;
            // Make a post request to change the votes, and then a get request to update the browser side
            ajaxRequest('POST', "https://joinordie.glitch.me/api/:vote?data=" + result + "&question=" + pollObject[page].question, function() {});
        }, false);
        for (var key in pollObject[page]) {
            if (key != 'question' && key != "user" && key != "_id") {
                var value = key;
                replies.innerHTML += "<label><input type='radio' value = '" + value + "' name='reply'>" + value + "</label>";
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
        //Remove ID, user, and question from the results
       
        keys.shift();
        values.shift();
      if(keys[0]=='user'){
        keys.shift();
        values.shift();
      }
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
    } else if (!isNaN(page) && page != "" && page != "create") {
        ready(ajaxRequest('GET', apiUrl + "api/listings", showVotingOptions));
    }
}; 