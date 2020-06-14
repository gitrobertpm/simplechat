// module.exports = function(io) {
//   var app = require('express');
//   var router = app.Router();

//   io.sockets.on('connection', function(socket) {
//     socket.on('username', function(username) {
//         socket.username = username;
//         io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
//     });
  
//     socket.on('disconnect', function(username) {
//         io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
//     })
  
//     socket.on('chat_message', function(message) {
//         io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
//     });
  
//   });

//   return router;
// }

const app = require('express');

const myo = (io) => {
  const router = app.Router();

  io.sockets.on('connection', socket => {
    socket.on('username', username => {
        socket.username = username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' has joined the chat..</i>');
    });
  
    socket.on('disconnect', username => {
        io.emit('is_online', '🔴 <i>' + socket.username + ' has left the chat..</i>');
    })
  
    socket.on('chat_message', message => {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });
  
  });

  return router;
}

module.exports = myo;