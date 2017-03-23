function calcDistanceMeter(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
  Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
  Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return Math.floor(d * 1000);
}

function calcBearing(lat1,lon1,lat2,lon2) {
  var lat1 = deg2rad(lat1);
  var lon1 = deg2rad(lon1);
  var lat2 = deg2rad(lat2);
  var lon2 = deg2rad(lon2);
  var lonDiff = lon2 - lon1;
  var X = Math.cos(lat2) * Math.sin(lonDiff);
  var Y =
  (Math.cos(lat1) * Math.sin(lat2)) - (Math.sin(lat1) * Math.cos(lat2) *
  Math.cos(lonDiff));
  var d = Math.atan2(X,Y) * (180 / Math.PI);
  if (d < 0){
    d += 360;
  }
  return Math.floor(d);
}
function relativeBearing(bearing, compass) {
  var rel = bearing + compass;
  if (rel > 360){
    rel = rel - 360;
  }
  return Math.floor(rel);
}
function calcTime(dist) {
  var minsec = new Array();
  var avgSpeed = 85;    // ORIGINALLY 83.3333 - choose based on walking towards + roads not as the crow flies
  minsec[0] = Math.floor(dist / avgSpeed);
  minsec[1] = Math.round(((dist/avgSpeed) - minsec[0]) * 60);
  return minsec;
}
function deg2rad(deg) {
  return deg * (Math.PI/180)
}
function compassHeading(alpha, beta, gamma) {
  // Convert degrees to radians
  var alphaRad = alpha * (Math.PI / 180);
  var betaRad = beta * (Math.PI / 180);
  var gammaRad = gamma * (Math.PI / 180);
  // Calculate equation components
  var cA = Math.cos(alphaRad);
  var sA = Math.sin(alphaRad);
  var cB = Math.cos(betaRad);
  var sB = Math.sin(betaRad);
  var cG = Math.cos(gammaRad);
  var sG = Math.sin(gammaRad);
  // Calculate A, B, C rotation components
  var rA = - cA * sG - sA * sB * cG;
  var rB = - sA * sG + cA * sB * cG;
  var rC = - cB * cG;
  // Calculate compass heading
  var compassHeading = Math.atan(rA / rB);
  // Convert from half unit circle to whole unit circle
  if(rB < 0) {
    compassHeading += Math.PI;
  }else if(rA < 0) {
    compassHeading += 2 * Math.PI;
  }
  // Convert radians to degrees
  compassHeading *= 180 / Math.PI;
  return compassHeading;
}
var data = {};

window.addEventListener("deviceorientation", handleOrientation, true);
function handleOrientation(event) {
  var absolute = event.absolute;
  var alpha    = event.alpha;
  var beta     = event.beta;
  var gamma    = event.gamma;
  bearing = compassHeading(360 - alpha, 0, 90);
  //$("#bearing").html("<h1>" + bearing +  "</h1>");
  var degrees = bearing;
  var bear = calcBearing(data.mylat, data.mylong, data.otherlat, data.otherlong);
  var relBear = relativeBearing(bear, bearing);
  //var time = calcTime(dist);

  //$("#time").html("<p3>" + time[0] + "min" + time[1] + "sec" + "</p3>");

  $("#bearing-debug").html("<p1>" + relBear + " degrees" +  "</p1>");
  // Do stuff with the new orientation data
  $("#filthy").css({'transform':'rotate('+relBear+'deg)'});
  //calculate theta:
  //rotate
  //180 is boiler plate, just place holder
  //keep rotation going
}
var data = {};
$(function () {
  var socket = io();
  // When people connect
  socket.on('connect', function(){
    socket.emit('register', window.location.href);
  });
  // Timer for position update
  setInterval(()=>getPos(), 2500);
  // Console logging the {lat, long, id}
  socket.on('coordinates', function(msg){
    //socket.emit('data', msg);
    //console.log(msg);
  });
  socket.on('full room', function(msg){
    console.log("FUCKKK",msg);
    window.location.assign("https://fiind.azurewebsites.net/");
  });
  //getting data from server TO DO
  socket.on('data', function(JSONdata) {
    incoming_data = JSON.parse(JSONdata);
    if ('otherlat' in incoming_data) {
      data = incoming_data;
      var dist = calcDistanceMeter(data.mylat, data.mylong, data.otherlat, data.otherlong);
      if(dist>1){
        $("#distance").html("<h1>" + dist + " meters" +  "</h1>");
      }
      else if(dist < 20){
        $("#distance").html("<h1>" + dist + " meters" +  "</h1>");
        $("body").css({"background": "linear-gradient(180deg, #66C9C7,red)"});
      }

      else{
        $("#distance").html("<h1>" + dist + " meter" +  "</h1>");
      }
      console.log("data", data);
    }
  });
});
// Gets position from browser
function setPos(position) {
  console.log('getpos');
  var socket = io();
  let mylat = position.coords.latitude;
  let mylong = position.coords.longitude;
  var my_coordinates = {mylat, mylong}
  //console.log(my_coordinates);
  socket.emit('coordinates', my_coordinates);
  //might not need to emit this, using this on this file
  //socket.emit('coordinates', {mylat, mylong});
}
function getPos() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(this.setPos, (err)=>{console.warn(`ERROR(${err.code}): ${err.message}`)}, {enableHighAccuracy: true, maximumAge: 2000});
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}
function getHeading(gps1, gps2){
  gpsHeading.calculate(gps1, gps2, function(heading) {
    return (heading.degree);
    //   console.log(heading.radian);
  });
}
function getHeadingSync(gps1, gps2){
  var heading = gpsHeading.calculateSync(gps1, gps2);
  return (heading.degree);
  //    console.log(heading.radian);
}
function rotate(theta, a){
  a.rotate(theta/180);
}
