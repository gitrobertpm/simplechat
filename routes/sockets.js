const app = require('express');
const fs = require('fs');
const helpers = require('../helpers');
const savedText = require('../text');

const myo = (io) => {
  const router = app.Router();

  io.sockets.on('connection', socket => {
    socket.on('username', username => {
      socket.username = username;
      io.emit('is_online', '🔵 <i>' + socket.username + ' has joined the chat...</i>');
    });
  
    socket.on('disconnect', username => {
      io.emit('is_online', '🔴 <i>' + socket.username || username + ' has left the chat...</i>');
    })

    socket.on('is_typing', user => {
      io.emit('is_typing', user);
    })

    socket.on('not_typing', user => {
      io.emit('not_typing', user);
    })
  
    socket.on('chat_message', async message => {

      savedText.text.push(message);

      if (savedText.text.length > 50) {
        savedText.text.splice(0, savedText.text.length - 50);
      }

      const newText = {
        "text": [...savedText.text]
      }

      try {
        await fs.promises.writeFile(`./text.json`, JSON.stringify(newText));
      } catch(err) {
        console.log('err : ', err);
        next(err);
      }

      io.emit('chat_message', message);
    });  
  });

  return router;
}

module.exports = myo;