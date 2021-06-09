var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

var countConnect = 0;
var onlineUser = [];

io.on('connection', (socket) => {
  let addedUser = false;
    socket.on('disconnect', () => {
      io.emit('leave chat', `${socket.username} Leave Chat`);
      
      // Remove LIst Online
      onlineUser.splice(onlineUser.findIndex(e => e.name === socket.username),1);
      io.emit('online_user', onlineUser);
    });

    socket.on('chat message', (msg) =>{
      io.emit('chat message', {username: socket.username, msg:msg});
    })

    socket.on('add user',(username) => {
     if (addedUser) return;
     addedUser = true;
     socket.username = username; 
   
     var user = {
       "username": username
     }
     onlineUser.push(user);
     io.emit('online_user', onlineUser);
     io.emit('join chat', `${username} Joined Chat`);
    })
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});