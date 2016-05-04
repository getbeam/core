'use strict';

const { Person } = require('../../lib/database').models;

class PersonController {
  static byId(id) {
    return new Promise((resolve, reject) => {
      Person.findOne({ id })
      .then(person => {
        resolve(person);
      }).catch(ex => {
        reject(ex);
      });
    });
  }
}

module.exports = PersonController;
