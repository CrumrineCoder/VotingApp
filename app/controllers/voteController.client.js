//'use strict';
/*
This file handles adding votes to a poll as well as displaying the data to the user. 
It adds an event listener to the vote button to update the poll, and everytime the event happens the pie chart is also updated.
The pie chart is updated on first loading the page as well. 
*/
function insertAfter(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}
var i = 2; 

window.onload = function() {
   
    //var poll = document.querySelector('.poll');
    //var result = null;
    //var voteNbr = document.querySelector('#vote-nbr');
    var apiUrl = 'https://joinordie.glitch.me/api/:vote?';
    var submitButton = document.getElementsByClassName("submit")[0];

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
    var latestInputField = document.getElementsByName("answer2")[0]; 
    latestInputField.addEventListener("input", handler);
    var lineBreak = document.createElement("br");
    
    function handler(e){ 
        i++;
        e.target.removeEventListener(e.type, arguments.callee);
        var input = document.createElement("input");
        var form = document.getElementsByClassName('poll')[0];        
        input.type = "text";
        input.name = "answer" + i; 
        input.placeholder = "Enter reply";
        form.insertBefore(input, submitButton);
        latestInputField = document.getElementsByName("answer"+i)[0]; 
        latestInputField.addEventListener("input", handler);
    }
};
