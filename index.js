const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
var path = require('path');
server.listen(80);

// Routing
app.use("/public", express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', (socket) => {
  // Event when on received data from draw
  socket.on('draw', function(data){
    socket.broadcast.emit('draw', data);
  });
});
