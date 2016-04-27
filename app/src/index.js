// Startup chain:
//  - register .env
//  - connecting to the database
//  - starting the server

require('dotenv').config();

const listen = require('./server').listen;

Promise.resolve()
  .then(listen)
  .catch(e => {
    console.error(e);
  });
