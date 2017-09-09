'use strict';
//<script src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.4/Chart.min.js" > < /script>
//window.Chart = require('chart.js');
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
    /*    var voteData = {
            labels: [keys],
            datasets: [{
                fillColor: "rgba(172,194,132,0.4)",
                strokeColor: "#ACC26D",
                pointColor: "#fff",
                pointStrokeColor: "#9DB86D",
                data: values
            }]
        }
        var voting = document.getElementById('chart').getContext('2d');
        new Chart(voting).line(voteData);

        var ctx = document.getElementById('chart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                [{
                    fillColor: "rgba(172,194,132,0.4)",
                    strokeColor: "#ACC26D",
                    pointColor: "#fff",
                    pointStrokeColor: "#9DB86D",
                    data: values
                }]
            }
        });*/

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


        //      var ctx = document.getElementById('chart').getContext('2d');
        /* var chart = new Chart(ctx, {
           type: 'line',
           data: {
             labels: keys,
             datasets: 
             [
               {
                 fillColor : "rgba(172,194,132,0.4)",
                 strokeColor : "#ACC26D",
                 pointColor : "#fff",
                 pointStrokeColor : "#9DB86D",
                 data : values
             }
             ]
           }
         }); 
        var myPieChart = new Chart(ctx, {
            type: 'pie',
            data: values,
            labels: keys
        });*/
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


})();