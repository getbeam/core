'use strict';

const { Person } = require('../../lib/database').models;

class PersonController {
  static read(req, res) {
    Person.findOne({
      id: req.params.id
    }).then(person => {
      console.log(person);
      res.json({ hello: 'world' });
    }).catch(e => {
      console.error(e);
      res.status(404).send('nooo!');
    });
  }

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
