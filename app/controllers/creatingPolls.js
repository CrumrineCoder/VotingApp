//Creating polls 

// Might want to change latestInputField to not exist by name but rather by ID and give each the same name of 'answer', or perhaps add a class called answer. Depends on how I want to retrieve the data from mongodb. 
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