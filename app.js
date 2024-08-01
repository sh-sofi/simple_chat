const http = require('http');
const fs = require('fs');
const socketIo = require('socket.io');

const server = http.createServer((req, res) => {
  fs.promises.readFile(__dirname + "/index.html")
    .then(contents => {
      res.setHeader("Content-Type", "text/html");
      res.writeHead(200);
      res.end(contents);
    })
    .catch(err => {
      res.writeHead(500);
      res.end(err);
      return;
    });
});

const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.emit('message', 'Welcome to the chat!');

  socket.broadcast.emit('message', 'A user has joined the chat');

  socket.on('chatMessage', (message) => {
    io.emit('message', `${message.userName}: ${message.text}`);
  });

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left the chat');
    console.log('User disconnected');
  });
});

const port = 3000;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});