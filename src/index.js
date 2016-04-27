// Startup chain:
//  - register .env
//  - connecting to the database
//  - starting the server

require('dotenv').config();

const connect = require('./lib/database').connect;
const listen = require('./server').listen;

Promise.resolve()
  .then(connect)
  .then(listen)
  .catch(e => {
    console.error(e);
  });
