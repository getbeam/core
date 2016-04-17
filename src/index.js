/* eslint-disable */

// Startup chain:
//  - register .env
//  - register marko view engine
//  - connecting to the database
//  - starting the server

require('dotenv').config();
require('marko/node-require').install();

const app = require('./app').default;
const connect = require('./database').connect;

// marko template hot reloading in development
// (Without this the server needs to be restarted when changing views)
if (process.env.NODE_ENV === 'development') {
  require('./lib/marko-hot-reload').register(app.get('views'));
}

Promise.resolve()
  .then(connect)
  .then(function() {
    app.listen(3000, function () {
      console.log('Hello!');
    });
  });
