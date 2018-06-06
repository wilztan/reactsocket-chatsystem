const express = require('express');
const app = express();
const http = require('http');
const socketIO = require('socket.io');


// port
const port = 4001;

//Server Instance
const server = http.createServer(app);

//declare socket
const io = socketIO(server);

app.get('/',(req, res) => res.send('Hello World!'));

io.on('connection',socket=>{
  console.log("a User connected");


  socket.on('disconnect',()=>{
    console.log("a User disconnected");
  })
});


//Console MESSAGE
io.on('connection', function(socket){
  socket.on('message', function(msg){
    console.log('message: ' + msg);
  });
});

//GET MESSAGE
io.on('connection', function(socket){
  socket.on('message', function(msg){
    io.emit('message', msg);
  });
});

server.listen(port,()=>{
  console.log("Listening on port :"+port);
});
