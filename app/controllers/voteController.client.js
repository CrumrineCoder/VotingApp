'use strict';
/*
This file handles adding votes to a poll as well as displaying the data to the user. 
It adds an event listener to the vote button to update the poll, and everytime the event happens the pie chart is also updated.
The pie chart is updated on first loading the page as well. 
*/
/*
(function() {
    var addButton = document.querySelector('.submit');
    var result = null;
    var voteNbr = document.querySelector('#vote-nbr');
    var apiUrl = 'https://joinordie.glitch.me/api/:vote?';

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
    

    function updatevoteCount(data) {
        var votesObject = JSON.parse(data);
        var keys = [],
            values = [];
        for (var i in votesObject) {
            keys.push(i);
            values.push(votesObject[i]);
        }


        var ctx = document.getElementById("chart").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: keys,
                datasets: [{
                    backgroundColor: [
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
    // Do updateVoteCount as soon as the document has finished loading
    ready(ajaxRequest('GET', apiUrl, updatevoteCount));

    addButton.addEventListener('click', function() {
        // Check if a radio is checked
        result = document.querySelector('input[name= "question"]:checked').value;
        console.log("Result: " + result);
        // Make a post request to change the votes, and then a get request to update the browser side
        ajaxRequest('POST', apiUrl + "data=" + result, function() {
            ajaxRequest('GET', apiUrl, updatevoteCount)
        });
    }, false);


})();*/