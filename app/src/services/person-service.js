'use strict';

const Service = require('../../lib/service');
const PersonController = require('../controllers/person-controller');

/** Service for Person Routes */
class PersonService extends Service {
  get() {
    PersonController.byId(this.param('id'))
      .then(person => {
        this.json(person);
      }).catch(ex => {
        this.next(ex);
      });
  }

  /*post() {
    PersonController.create()
      .then(person => {
        this.status(201).json(person);
      }).catch(ex => {
        this.next(ex);
      });
  }*/
}

module.exports = PersonService;
