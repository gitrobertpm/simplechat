"use strict"

const signInContainer= document.querySelector('#sign-in-container');
const signInForm = document.querySelector('#sign-in-form');
const usernameInput = document.querySelector('#username-input');
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const chatBoard = document.querySelector('#chat-board');
const isTyping = document.querySelector('#is-typing');

let user = '';
let typing = false;
let typingTimer_1 = undefined; 

const socket = io.connect('https://lailassimplechatapp.herokuapp.com/');
// const socket = io.connect('https://localhost:5000/');

chatBoard.scrollTop = chatBoard.scrollHeight;

usernameInput.focus();
if (localStorage.getItem('username')) {
  usernameInput.value = localStorage.getItem('username');
}

const formattedTime = () => {
  const t = new Date().toLocaleTimeString().split('');
  const aOrPm = t.splice(-2);
  t.splice(t.lastIndexOf(':'));
  const time = [...t, ' ', ...aOrPm].join('');
  return time;
}


// TODO - Add security and validation
const inputIsOkay = input => {
  const noNos = ['<', '>', '[', ']', '{', '}', '(', ')', '*']
  for (let i = 0, j = noNos.length; i < j; i++) {
    if (input.includes(noNos[i])) {
      return false;
    }
  }
  return true;
}


/**
 * SignIn - Get username
 */
signInForm.addEventListener('submit', e => {
  e.preventDefault();
  user = usernameInput.value.trim();

  if (user === '') {
    alert('Please enter a username in the field provided');
    return false;
  } 

  if (!inputIsOkay(user)) {
    alert('No brackets or asterisks. Please enter a valid username in the field provided');
    return false;
  } 
  
  localStorage.setItem('username', user);
  socket.emit('username', user);
  usernameInput.value = '';
  signInContainer.classList.add('hide');
  return false;
});


/**
 * Chat submission
 */
chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = chatInput.value.trim();

  if (message === '') {
    alert("Don't spam with blank text, yo!");
    return false;
  } 

  if (!inputIsOkay(message)) {
    alert('No brackets or asterisks. Please enter valid text in the field provided');
    return false;
  } 

  socket.emit('chat_message', [user, formattedTime(), message]);
  chatInput.value = '';
  return false;
});

chatInput.addEventListener('keyup', e => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (e.key === 'Enter') {
    if (message === '' || message.length === 1) {
      alert("Don't spam with blank text, yo!");
      return false;
    }

    socket.emit('chat_message', [user, formattedTime(), message]);
    chatInput.value = '';
    typing = false;
    socket.emit('not_typing', user);
    return false;
    
  }

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
});




// append the chat text message
socket.on('chat_message', msg => {
  chatBoard.insertAdjacentHTML('beforeEnd', `<li><span class="chat-username">${msg[0]}</span>: <span class="chat-time">${msg[1]}</span><p class="chat-msg">${msg[2]}</p></li>`);
  chatBoard.scrollTop = chatBoard.scrollHeight + 100;
});

// append text if someone is online
socket.on('is_online', msg => {
  chatBoard.insertAdjacentHTML('beforeEnd', `<li>${msg}</li>`);
  chatBoard.scrollTop = chatBoard.scrollHeight + 100;
});

socket.on('is_typing', userTyping => {
  if (userTyping !== user) {
    isTyping.innerHTML += ` <span class="is-typing-text" id="is-typing-${userTyping}"> ${userTyping} is typing... </span> `;
  }
});

socket.on('not_typing', userTyping => {
  const isTypingElement = document.getElementById(`is-typing-${userTyping}`);
  if (isTypingElement) {
    isTypingElement.parentNode.removeChild(isTypingElement);
  }
});


console.log('test');