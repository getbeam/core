'use strict';

const async = require('async');
const { Person } = require('../../lib/database').models;

class PersonController {
  static byId(id) {
    return new Promise((resolve, reject) => {
      Person.findById(id)
        .then(person => {
          resolve(person);
        }).catch(ex => {
          reject(ex);
        });
    });
  }

  static findOne(query) {
    return Person.findOne(query);
  }

  static create(newUserData) {
    const idRange = { bottom: 999, top: 99999999 };
    const fill = 1000000000;

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getNewId() {
      return fill + getRandomInt(idRange.bottom, idRange.top);
    }

    let isUnique;
    let testId = getNewId();

    return new Promise((resolve, reject) => {
      async.doWhilst(
        // Do this...
        callback => {
          Person.findById(testId)
            .then(person => {
              if (person) {
                if (testId >= fill + idRange.top) {
                  testId = getNewId();
                } else {
                  testId++;
                }

                isUnique = false;
              } else {
                isUnique = true;
              }

              callback(null, testId);
              return null;
            })
            .catch(ex => {
              return callback(ex);
            });
        },
        // while this returns true.
        () => {
          return !isUnique;
        },
        // If whilst-assignment is false, do this:
        (ex, uniqueId) => {
          if (ex) return reject(ex);

          return Person
            .build({
              id: uniqueId,
              displayName: newUserData.name,
              emailAddress: newUserData.email
            })
            .save()
            .then(newPerson => {
              return resolve(newPerson);
            })
            .catch(ex2 => {
              return reject(ex2);
            });
        }
      ); // end async dowhilst
    });
  }
}

module.exports = PersonController;
