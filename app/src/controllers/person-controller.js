"use strict";

const async = require("async");
const { orm } = require("../../lib/database");
const { Person } = require("../../lib/database").models;
const { LinkedAccount } = require("../../lib/database").models;

/** Controller for Person Model */
class PersonController {
  /**
   * Queries a Person by its id.
   * @param  {Integer} id - Id of Person.
   * @return {Promise} Resolves with found Person (or null).
   */
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

  /**
   * Alias for Person.findOne()
   * @param  {Object} query - Sequelize query.
   * @return {Promise} See Model.findOne()
   */
  static findOne(query) {
    return Person.findOne(query);
  }

  /**
   * Creates a new Person.
   * @param  {Object} newData - The Person's data to store.
   * @return {Promise} Resolves with created Person.
   */
  static create(newData, authData) {
    const idRange = { bottom: 999, top: 99999999 };
    const fill = 1000000000;

    // The ID consists of a random Integer (between 999 and 99999999) and
    // a "fill" (1000000000). The highest possible ID would be:
    // This generates IDs between 1000000999 and 1099999999

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getNewId() {
      return fill + getRandomInt(idRange.bottom, idRange.top);
    }

    let isUnique;
    let testId = getNewId();

    return new Promise((resolve, reject) => {
      // In this async do-while loop, we search if the random ID already exists.
      // The loop exists if the ID is not found in the database (ID is unique).

      async.doWhilst(
        // [async] Do this...
        callback => {
          // Find Person by ID. If Person is found (ID already exists),
          // increase the ID by 1. If the ID is the highest possible ID,
          // generate new random ID.
          // If ID is finally unique, break out of the loop.

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
              } // end if (person)
              callback(null, testId);
              return null;
            })
            .catch(ex => {
              return callback(ex);
            });
        },
        // [async] ...while this returns true.
        () => {
          return !isUnique;
        },
        // [async] If whilst-assignment is false, do this:
        (ex, uniqueId) => {
          if (ex) return reject(ex);

          let createdPerson;

          return orm.transaction(t => {
            return Person.create(
              Object.assign({}, { id: uniqueId }, newData),
              { transaction: t }
            )
            .then(newPerson => {
              createdPerson = newPerson;
              return LinkedAccount.create({
                provider: authData.provider,
                foreignUserId: authData.id,
                personId: newPerson.id
              }, { transaction: t });
            })
            .then(savedLinkedAccount => {
              return createdPerson;
            });
          })
          .then(result => {
            return resolve(result);
          })
          .catch(ex2 => {
            return reject(ex2);
          });
        }
      ); // end async.doWhilst
    }); // end Promise
  } // end method create()

  /**
   * Update a Person by its Id.
   * @param  {Integer} id - Person's Id.
   * @param  {Object} values - Values to update
   * @return {Promise} Resolves with updated Person.
   */
  static updateById(id, values) {
    return Person.update(values, { where: { id }, returning: true })
      .then(([affected, rows]) => {
        return rows[0];
      });
  }

  /**
   * Delete a Person by its Id.
   * @param  {Integer} id - The person's Id.
   * @return {Promise} Resolves with true, if Person is deleted and with false,
   *                   if Person wasn't found.
   */
  static deleteById(id) {
    return new Promise((resolve, reject) => {
      Person.findById(id)
        .then(existingPerson => {
          if (!existingPerson) {
            return resolve(false);
          }

          return existingPerson.destroy();
        })
        .then(() => {
          return resolve(true);
        })
        .catch(ex => {
          return reject(ex);
        });
    });
  }
}

module.exports = PersonController;
