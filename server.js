const express = require('express');
const app  = express();
const http = require('http').Server(app);
const io   = require('socket.io')(http);

var users = {};
var usernames = [];

app.use(express.static("public"));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  //broadcast other user
  socket.broadcast.emit('newMessage', 'Someone Connected')

  //validate user register
  socket.on('registerUser', function(username){
    //validate user if usernames not contain in user
    if (usernames.indexOf(username) != -1) {
      socket.emit('registerRespond', false);
    } else {
      // add key/id from socket id user to usernames
      users[socket.id] = username;
      usernames.push(username);
      socket.emit('registerRespond', true);
      io.emit('addOnlineUsers', usernames);
      console.log(users);
      console.log("--------");
      console.log(usernames);
    }
  });


  //if has new messages
  socket.on('newMessage', function(msg){
    io.emit('newMessage', msg);
    console.log('new message : ' + msg)
  });

  socket.on('disconnect', function(msg){
    console.log('user disconnected');
    //broadcast other user
    socket.broadcast.emit('newMessage', 'Someone Disconnected')
  });

});

http.listen(3000, function(){
  console.log('listening on 3000...');
});
