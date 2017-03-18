var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var sessions = {};

app.get('/', function(req, res){
	res.sendFile(__dirname + '/static/landing.html');
});

app.use('/', express.static('static'))

app.get('/connect/:id', function(req, res){
	res.sendFile(__dirname + '/static/connect.html');
});

io.on('connection', function(socket){
  socket.on('lat long1', function(msg){
    msg['user_id'] = socket.id;
    io.emit('lat long1', msg);
  });

  socket.on('register', function(msg){
    console.log(sessions);
    if (sessions[msg] >= 2) {
      io.emit('fuck off');
    } else if (sessions[msg]) {
      sessions[msg] += 1;
    } else {
      sessions[msg] = 1;
    }
  	//console.log(user);
  })
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
