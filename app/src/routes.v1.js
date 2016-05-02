const { Router } = require('express');

const { User } = require('../lib/db');

// eslint-disable-next-line new-cap
const routes = Router();

routes.get('/', (req, res) => {
  res.send('It works!');
});

module.exports = routes;
