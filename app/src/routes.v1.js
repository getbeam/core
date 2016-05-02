const { Router } = require('express');

const { User } = require('../lib/db');

// eslint-disable-next-line new-cap
const routes = Router();

routes.get('/', (req, res) => {
  User.create({
    username: 'blablabla'
  }).then(bla => {
    res.json(bla);
  });
});

module.exports = routes;
