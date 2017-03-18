var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var sessions = {};
var user_session = {};
var room_users = {};

app.get('/', function(req, res){
	res.sendFile(__dirname + '/static/landing.html');
});

app.use('/', express.static('static'))

app.get('/connect/:id', function(req, res){
	res.sendFile(__dirname + '/static/connect.html');
});

io.on('connection', function(socket){

  // recieves and sends lat and long to server
  socket.on('lat long1', function(msg) {
    msg['user_id'] = socket.id;
    msg['room'] = user_session[socket.id];
    io.emit('lat long1', msg);
  });

  socket.on('disconnect', function(msg) {
	console.log("SERVERdisconnect!!@!!!!");
    console.log(user_session[socket.id]);
    sessions[user_session[socket.id]] -= 1;
    delete user_session[socket.id];
    console.log('SERVERsessions: ', sessions);
  });

  socket.on('register', function(msg){
    user_session[socket.id] = msg;
    console.log("SERVER"+user_session[socket.id]);
    if (sessions[msg] >= 2) {
      if (io.sockets.connected[socket.id]) {
        io.sockets.connected[socket.id].emit('fuck off');
      }
    } else if (sessions[msg]) {
      sessions[msg] += 1;
    } else {
      sessions[msg] = 1;
    }
    //console.log(sessions);
  })
});



var gpsHeading = require('node-gps-heading');

var gps1 = {
  lat: -31.0000000,
  lng: 115.8480000
}

var gps2 = {
  lat: -32.0000000,
  lng: 115.8480000
}

gpsHeading.calculate(gps1, gps2, function(heading) {
  console.log(heading.degree);
  console.log(heading.radian);
});

var heading = gpsHeading.calculateSync(gps1, gps2);
console.log(heading.degree);
console.log(heading.radian);















http.listen(port, function(){
  console.log('listening on *:' + port);
});
