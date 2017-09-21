//Creating polls 

// This file creates polls in the create.handlebars file procedurely by making an event listener on the second reply and removing it so that only the third response is made, which itself has the same event listener so the user can make as many replies as they want
var i = 2; 
window.onload = function() {
  var submitButton = document.getElementsByClassName("submit")[0];
    var latestInputField = document.getElementsByName("answer2")[0]; 
    latestInputField.addEventListener("input", handler);
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
}