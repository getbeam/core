'use strict';

const Service = require('../../lib/service');
const { Person } = require('../../lib/database').models;

/** Service for Person Routes */
class PersonService extends Service {
  read() {
    Person.findOne({
      id: this.param('id')
    }).then(person => {
      this.json(person);
    }).catch(ex => {
      this.res.status(404).json(ex);
    });
  }
}

module.exports = PersonService;
