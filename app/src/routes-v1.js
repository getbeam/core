'use strict';

const { Router } = require('express');
const PersonService = require('./services/person-service');

// eslint-disable-next-line new-cap
const routes = Router();

routes.get('/persons/:id',
  PersonService.call('get')
);
routes.post('/persons',
  PersonService.call('post')
);

module.exports = routes;
