/* eslint-disable */

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
