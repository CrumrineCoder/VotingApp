'use strict';


(function () {
  var addButton = document.querySelector('.submit'); 
  var result = null; 
   var voteNbr = document.querySelector('#vote-nbr');
   var apiUrl = 'https://joinordie.glitch.me/api/votes';

   function ready (fn) {
     // Will do the function once the document is ready
      if (typeof fn !== 'function') {
         return;
      }

      if (document.readyState === 'complete') {
         return fn();
      }

      document.addEventListener('DOMContentLoaded', fn, false);
   }

   function ajaxRequest (method, url, callback) {
      var xmlhttp = new XMLHttpRequest();
    // Everytime the readystage changes, we're checking if it's done, and if so this function will do the callback
      xmlhttp.onreadystatechange = function () {
         if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            callback(xmlhttp.response);
         }
      };

      xmlhttp.open(method, url, true);
      xmlhttp.send();
   }

  function updatevoteCount (data) {
   var votesObject = JSON.parse(data);
   voteNbr.innerHTML = votesObject.votes;
 }
   ready(ajaxRequest('GET', apiUrl, updatevoteCount));
    
   addButton.addEventListener('click', function () {
     console.log("HONK");
      ajaxRequest('POST', apiUrl, result);
   }, false);


})();