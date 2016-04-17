/* eslint-disable */

// Startup chain:
//  - register .env
//  - connecting to the database
//  - starting the server 

require('dotenv').config();

const app = require('./app').default;
const connect = require('./database').connect;

Promise.resolve()
  .then(connect)
  .then(function() {
    app.listen(3000, function () {
      console.log('Hello!');
    });
  });
