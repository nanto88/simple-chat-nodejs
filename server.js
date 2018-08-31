const express = require('express');
const app  = express();
const http = require('http').Server(app);
const io   = require('socket.io')(http);

app.use(express.static("public"));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  //if has new messages
  socket.on('newMessage', function(msg){
    io.emit('newMessage', msg);
    console.log('new message : ' + msg)
  });

  socket.on('disconnect', function(msg){
    console.log('user disconnected');
  });
  
});

http.listen(3000, function(){
  console.log('listening on 3000...');
});
