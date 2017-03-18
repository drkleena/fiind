var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var sessions = {};
var user_session = {};

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

  socket.on('disconnect', function(msg) {
    console.log(user_session[socket.id]);
    sessions[user_session[socket.id]] -= 1;
    delete user_session[socket.id];
    console.log(sessions);
  });

  socket.on('register', function(msg){
    user_session[socket.id] = msg;
    console.log(user_session);
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

http.listen(port, function(){
  console.log('listening on *:' + port);
});
