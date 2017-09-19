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
      //  alert(input);
     //   alert(input.innerHTML);
      /*
      
    var s = '<div id="myDiv"></div>';
var temp = document.createElement('div');
temp.innerHTML = s;
var htmlObject = temp.firstChild;
*/
       input.appendChild(lineBreak);

      //  input.innerHTML = input.innerHTML + "<br>";
        form.insertBefore(input, submitButton);
       // submitButton.parentNode.insertBefore(lineBreak, submitButton.nextSibling);
        //document.getElementsByName("answer"+i)[0].appendChild()
      //  document.getElementsByName("answer"+i)[0].form.insertBefore(lineBreak, document.getElementsByName("answer"+i)[0].nextSibling);
        //form.insertBefore(lineBreak, submitButton);
        
        //latestInputField.appendChild(input); 

      //submitButton.insertBefore(input);
        //submitButton.insertBefore(document.createElement("br"));
        //form.appendChild(input);
        //form.appendChild(document.createElement("br"));

        latestInputField = document.getElementsByName("answer"+i)[0]; 
      //  latestInputField.outerHTML = '<div class="form-group">' + latestInputField.innerHTML + ' <br></div>'  
     //   console.log(latestInputField);
       // latestInputField.outerHTML = "AAAAAAAAAAAAAAAAAAAAAH";
     //   console.log(latestInputField);
        latestInputField.addEventListener("input", handler);
       // latestInputField.appendChild(document.createElement("br"));
     //   insertAfter(lineBreak, latestInputField);
      //  latestInputField.appendChild(lineBreak)
      //  newEvent(i);
      var markup = document.documentElement.innerHTML;
      console.log(markup);
    }
  
};
/*
function newEvent(i){
     var latestInputField = document.getElementsByName("answer"+i)[0]; 
     latestInputField.addEventListener("input", handler);
     console.log(latestInputField);
} */
// console.log("answer"+i);
 // console.log("I af: "+ i);
 // latestInputField = document.getElementsByName("answer"+i)[0]; 
 // console.log("Latest Input  Field outside Handler: " + latestInputField);
  //console.log(document.getElementsByName("answer2")[0]);
  
    /*
var i = 3;

function addInput(){
    // Might want to add validation for whether the first two text fields have inputs already in them, but that depends on the functionality of mongoose
    var input = document.createElement("input");
    var form = document.getElementsByClassName('poll')[0];
    input.type = "text";
    input.name = "answer" + i; 
    input.oninput = test();
    console.log(input);
    //input.oninput = addInput();
    form.appendChild(input);
    form.appendChild(document.createElement("br"));
    i++;
}
function test(){
  console.log("boople");
}
var form = document.getElementsByClassName('poll')[0];
*/
    /*addButton.addEventListener('click', function() {
        // Check if a radio is checked
  
        result = document.querySelector('input[name= "question"]:checked').value;
        // Make a post request to change the votes, and then a get request to update the browser side
        ajaxRequest('POST', apiUrl + "data=" + result, function() {
  
            ajaxRequest('GET', apiUrl, updatevoteCount);
 
        });
    }, false);*/
