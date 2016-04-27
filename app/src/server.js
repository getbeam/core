const express = require('express');
const v1 = require('./server.v1');

const server = express();

server.use('/v1', v1);


exports.listen = () => {
  server.listen(3000, () => {
    console.log('Hello!');
  });
};
