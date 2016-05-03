const express = require('express');
const v1 = require('./subapp-v1');

const server = express();

server.use('/v1', v1);


exports.listen = () => (new Promise((resolve, reject) => {
  server.listen(3000, () => {
    console.log('==> beam-core (re)loaded');
    resolve();
  });
}));
