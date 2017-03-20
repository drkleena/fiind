var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var sessions = {};
var user_session = {};
var room_users = {}; //this is the big boy data base

app.get('/', function(req, res){
	res.sendFile(__dirname + '/static/landing.html');
});

app.use('/', express.static('static'))

app.get('/connect/:id', function(req, res){
	res.sendFile(__dirname + '/static/connect.html');
});

io.on('connection', function(socket){

  // recieves coordinates from browser
  socket.on('coordinates', function(msg) {

  	//idk how this works but it sets coords to correct place
  	if(room_users[user_session[socket.id]][socket.id]){
  		room_users[user_session[socket.id]][socket.id] = msg;
  	}

    console.log(" ");
    console.log("room_users");
    console.log(room_users);

  	var obj = room_users[user_session[socket.id]];



    if (Object.keys(obj).length == 2) {

      var curid = socket.id;
      var mylat = obj[curid].mylat;
      var mylong = obj[curid].mylong;
      obj_vals = Object.keys(obj).map(function(key) {
		  return obj[key];
	  });
      for (i=0; i<2; i++) {
        if (obj_vals[i]['mylat'] != mylat) {
          var otherlat = obj_vals[i]['mylat'];
          var otherlong = obj_vals[i]['mylong'];

          data = {};
          data.mylat = mylat;
          data.mylong = mylong;
          data.otherlat = otherlat;
          data.otherlong = otherlong;

          if (io.sockets.connected[socket.id]) {
            JSONdata = JSON.stringify(data);
            console.log('JSONdata', JSONdata);
            io.sockets.connected[socket.id].emit('data', JSONdata);
          }
          }
        }
      }

    // if (io.sockets.connected[id]) {
    //
    //   io.sockets.connected[id].emit('full room');
    //
    //
  	// io.sockets.connected[socket.id].emit('data', obj);


  //
  (room_users[user_session[socket.id]][socket.id]);

  });

  socket.on('disconnect', function(msg) {
  	console.log(socket.id, "disconnected from", user_session[socket.id])

    //if disconnected browser was in room, removes from database
	for(var fieldName in room_users[user_session[socket.id]]){
	    if (socket.id == fieldName){
	    	delete room_users[user_session[socket.id]][socket.id];
	    }
	}

	//if room empty, deletes room
    var c=0;
	for(var fieldName in room_users[user_session[socket.id]]){

	    c++;
	}
	if(c==0){
		delete room_users[user_session[socket.id]];
	}

	//debugging to check who is in room, and their coords

  });


  //registers room id and personal id to room_users
  socket.on('register', function(msg){

  	//for disconnect function only!
  	user_session[socket.id] = msg;

  	//creates room if no one was previously in
  	if (!room_users[msg]) {
  		room_users[msg] = {};
	}

	//THIS COUNTS PEOPLE IN ROOM!!!!
	var c=0;
		for(var fieldName in room_users[user_session[socket.id]]){
		    c++;
		}

    //kicking additional connections
    if (c >= 2) {
      if (io.sockets.connected[socket.id]) {
        io.sockets.connected[socket.id].emit('full room');
        console.log("failed connection");
      }
   }
    //if space in room, adds to array of guests
     else {
      console.log(socket.id, "connected to", msg);
  	  room_users[user_session[socket.id]][socket.id] = {};

    }
    console.log(" ");
    console.log("room_users");
    console.log("FUCK",room_users);
  })
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
