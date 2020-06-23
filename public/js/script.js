"use strict"

const signInContainer= document.querySelector('#sign-in-container');
const signInForm = document.querySelector('#sign-in-form');
const usernameInput = document.querySelector('#username-input');
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const chatBoard = document.querySelector('#chat-board');
const isTyping = document.querySelector('#is-typing');

chatBoard.scrollTop = chatBoard.scrollHeight;

usernameInput.focus();

let user = '';
let typing = false;
let typingTimer_1 = undefined; 

var socket = io.connect('http://lailassimplechatapp.herokuapp.com/');

// TODO - Add security and validation
/**
 * SignIn - Get username
 */
signInForm.addEventListener('submit', e => {
  e.preventDefault();
  user = usernameInput.value;
  socket.emit('username', user);
  usernameInput.value = '';
  signInContainer.classList.add('hide');
  return false;
});


/**
 * Chat submission
 */
chatForm.addEventListener('submit', e => {
  e.preventDefault(); // prevents page reloading
  const message = chatInput.value.trim();
  socket.emit('chat_message', [user, message]);
  chatInput.value = '';
  return false;
});

chatInput.addEventListener('keyup', e => {
  e.preventDefault(); // prevents page reloading

  if (e.key === 'Enter') {
    if (chatInput.value === '') {
      alert("Don't spam with blank text, yo! &#x1F621;");
      return false;
    } else {
      const message = chatInput.value.trim();
      socket.emit('chat_message', [user, message]);
      chatInput.value = '';
      typing = false;
      socket.emit('not_typing', user);
      return false;
    }
    
  } else {
    if (!typing) {
      typing = true;
      socket.emit('is_typing', user);
      clearTimeout(typingTimer_1);
      typingTimer_1 = setTimeout(() => {
        typing = false;
        socket.emit('not_typing', user);
      }, 1000);
      return false;
    }
  }
});



// append the chat text message
socket.on('chat_message', msg => {
  chatBoard.insertAdjacentHTML('beforeEnd', `<li><span class="chat-username">${msg[0]}</span>: <span class="chat-msg">${msg[1]}</span></li>`);
  chatBoard.scrollTop = chatBoard.scrollHeight + 100;
});

// append text if someone is online
socket.on('is_online', username => {
  chatBoard.insertAdjacentHTML('beforeEnd', `<li>${username}</li>`);
  chatBoard.scrollTop = chatBoard.scrollHeight + 100;
});

socket.on('is_typing', userTyping => {
  if (userTyping !== user) {
    isTyping.innerHTML += `<span class="is-typing-text" id="is-typing-${userTyping}">${userTyping} is typing...</span>`;
  }
});

socket.on('not_typing', userTyping => {
  const isTypingElement = document.getElementById(`is-typing-${userTyping}`);
  if (isTypingElement) {
    isTypingElement.parentNode.removeChild(isTypingElement);
  }
});


console.log('test');