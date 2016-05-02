// Startup chain:
//  - register .env
//  - connecting to the database
//  - starting the server

require('dotenv').config();

const listen = require('./server').listen;
const db = require('../lib/db');

console.log('Server startup');

Promise.resolve()
  .then(db.sequelize.sync())
  .then(listen)
  .catch(e => {
    console.error(e);
  });
