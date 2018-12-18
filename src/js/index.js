import jQuery from 'jquery';
import popper from 'popper.js';
import bootstrap from 'bootstrap';

jQuery(function() {
    //jQuery('body').css('color', 'blue');
});

// $( document ).ready(function() {
//    var video = document.getElementById('video');
//    video.addEventListener('click',function(){
//     video.play();
//     },false);
// });
var ONLYONETIME_EXECUTE = null;
window.addEventListener('load', function(){ // on page load
 
    document.body.addEventListener('touchstart', function(e){
    
  if (ONLYONETIME_EXECUTE == null) {   

        var video = document.getElementById('video');

        video.play();

        ONLYONETIME_EXECUTE = 0;
        }

    }, false)
 
}, false)