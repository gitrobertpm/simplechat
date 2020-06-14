"use strict"

const form = document.querySelector('form');
const board = document.querySelector('.board');
const chat = document.querySelector('.chat-box');
const text = document.querySelector('textarea');

var socket = io.connect('http://localhost:5000');

// submit text message without reload/refresh the page
form.addEventListener('submit', e => {
    e.preventDefault(); // prevents page reloading
    socket.emit('chat_message', chat.value);
    chat.value = '';
    return false;
});

text.addEventListener('keyup', e => {
  e.preventDefault(); // prevents page reloading
  if (e.key === 'Enter') {
    socket.emit('chat_message', chat.value);
    chat.value = '';
    return false;
  }
});



// append the chat text message
socket.on('chat_message', msg => {
  board.insertAdjacentHTML('beforeEnd', `<li>${msg}</li>`);
});

// append text if someone is online
socket.on('is_online', username => {
  board.insertAdjacentHTML('beforeEnd', `<li>${username}</li>`);
});

// ask username
var username = prompt('Please tell me your name');
socket.emit('username', username);


console.log('test');