// Startup chain:
//  - register .env
//  - connecting to the database
//  - starting the server

const startTime = new Date();

require('dotenv').config();

const listen = require('./app').listen;
const Database = require('../lib/database');

Promise.resolve()
  .then(Database.orm.sync())
  .then(listen)
  .then(() => {
    const endTime = new Date();
    const startupTime = endTime.getTime() - startTime.getTime();
    console.log(`Server startup time: ${startupTime}ms`);
  })
  .catch(e => {
    console.error(e);
  });
