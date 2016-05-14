"use strict";

const { orm, randomId } = require("../../lib/database");
const { Person, LinkedAccount } = require("../../lib/database").models;

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

    return randomId(Person, { idRange, fill })
    .then(uniqueId => {
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
      });
    })
    .then(result => {
      return result;
    })
    .catch(ex2 => {
      throw ex2;
    });
  } // end method create()

  /**
   * Update a Person by its Id.
   * @param  {Integer} id - Person's Id.
   * @param  {Object} values - Values to update
   * @return {Promise} Resolves with updated Person.
   */
  static updateById(id, values) {
    return Person.update(values, { where: { id }, returning: true })
      .then(([affected, rows]) => { // TODO: jscs - this looks weird
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
