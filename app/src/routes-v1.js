'use strict';

const { Router } = require('express');
const PersonController = require('./controllers/person-controller');

// eslint-disable-next-line new-cap
const routes = Router();

routes.get('/persons/:id', PersonController.read);
routes.post('/persons', PersonController.create);

module.exports = routes;
