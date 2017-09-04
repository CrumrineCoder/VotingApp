'use strict';

(function () {

   var addButton = document.querySelector('.btn-add');

   var voteNbr = document.querySelector('#vote-nbr');
   var apiUrl = 'https://joinordie.glitch.me/api/votes';

   function ready (fn) {
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

   addButton.addEventListener('vote', function () {

      ajaxRequest('POST', apiUrl, function () {
         ajaxRequest('GET', apiUrl, updatevoteCount);
      });

   }, false);


})();
