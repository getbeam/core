'use strict';

const Controller = require('../../lib/controller');
const { Person } = require('../../lib/database').models;

/** Controller managing Person Model */
class PersonController extends Controller {
  read() {
    Person.findOne({
      id: this.param('id')
    }).then(person => {
      this.json(person);
    }).catch(ex => {
      this.res.status(404).json(ex);
    });
  }

  // @deprec
  static create(req, res) {
    Person.build({
      id: Math.ceil(Math.random() * 10000),
      displayName: 'timo',
      emailAddress: 'timo'
    }).save()
      .then(user => {
        console.log(user);
        res.json(user);
      })
      .catch(e => {
        console.error(e);
        res.status(404).json(e);
      });
  }
}

module.exports = PersonController;
