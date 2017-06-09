
var app = require('express')(); //bundles everything together, http not needed
var http = require('http').Server(app);

var io = require('socket.io')(http);
var nicknames={};
var rooms={};
app.get('/', function(req, res){
  
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){ 
  console.log('a user connected');
  socket.on('chat message', function(data){
   io.emit('chat message', {msg: data, user: socket.nickname});
	console.log('chk');
  });
  
  //handle nickname
  socket.on('new user', function(data, callback){
	
	if(data in nicknames){
		callback(false); //if nickname entered already exists
	}else{
		callback(true);
		
		socket.nickname=data; 
		nicknames[socket.nickname]=socket.id;
		console.log(socket.id);
		io.emit('usernames', Object.keys(nicknames));
	}
  });

  
  socket.on('disconnect', function(data){
	if(!socket.nickname)return;
	delete nicknames[socket.nickname];
	io.emit('usernames', Object.keys(nicknames));
  })
  
});

//We make the http server listen on port 3000
http.listen(3000, function(){
  console.log('listening on *:3000');
});