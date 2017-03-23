// import jquery
var script = document.createElement('script');

script.src = 'assets/js/jquery.min.js';

/**
* Returns a random number between min (inclusive) and max (exclusive)
*/
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

//sends user to their own room
$("#69420" ).click(function() {
  let session = Math.floor(getRandomArbitrary(1000, 9999)).toString();
  $("#69420").hide();
  console.log(session);
  let session_url = window.location + "connect/" + session;
  $(".major2").html("<a href=" + session_url + ">" + session_url + "</a>").css({"font-size":"2em"}).hide().fadeIn(1300);
  $("#click").replaceWith("<h2 id =\"mynext\">Start</h2>").hide().fadeIn(2000);
  $("#mynext").click(function(){
    window.open(session_url);
  });
});
