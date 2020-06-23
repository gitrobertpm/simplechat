const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const app = express();
const socket_io = require( 'socket.io' );

// Socket.io
const io = socket_io();
app.io = io;

const sockets = require('./routes/sockets')(io);
app.use(sockets);

const indexRouter = require('./routes');
// const usersRouter = require('./routes/users');

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true, contentType: "application/json; charset=utf-8"}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));


/* Root route redirect to the '/api/' route */
app.get('/', (req, res) => {
  // res.render('index', { title: 'Simple Chat'});
  res.redirect('/chat');
});

app.use('/chat', indexRouter);
// app.use('/api/users', usersRouter);


/* ERROR HANDLERS */

/* 404 handler to catch undefined or non-existent route requests */ 
app.use((req, res, next) => {

  // Log out 404 handler indication
  console.log('404 error handler called');

  res.status(404).render('not-found');
});

/* Global error handler */
app.use((err, req, res, next) => {

  // Log out global error handler indication
  if (err) {
    console.log('Global error handler called', err);
  }

  // If global error handler catches 404, render 'not-found' template
  if (err.status === 404) {
    res.status(404).render('not-found', { err });

  // Else render error template
  }  else {
    err.message = err.message || `Oops!  It looks like something went wrong on the server.`;
    res.status(err.status || 500).render('error', { err });
  }
});

// const server = https.listen(5000, function() {
//   console.log('listening on *:5000');
// });

module.exports = app;
