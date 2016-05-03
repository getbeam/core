'use strict';

const { Router } = require('express');

// eslint-disable-next-line new-cap
const routes = Router();

routes.get('/', (req, res) => {
  res.send('Hello!');
});

module.exports = routes;
