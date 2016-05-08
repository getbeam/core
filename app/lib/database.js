"use strict";

const Sequelize = require("sequelize");
const async = require("async");
const Models = require("./models");

const sequelize = new Sequelize("beam", "beam", "securepassword", {
  host: "localhost",
  dialect: "postgres"
});

const models = new Models(sequelize);

/** Utility Class for database management */
class Database {
  /**
   * Get instance of orm.
   * @return {Object} Sequelize Instance.
   */
  static get orm() {
    return sequelize;
  }

  /**
   * Get all models.
   * @return {Object} Instance of Model Class.
   */
  static get models() {
    return models;
  }

  /**
   * Generate a new random ID.
   * @param  {Sequelize.Model} Model - A Model in sequelize with `id` field.
   * @param  {function} generateId - Function to generate the first random id.
   * @param  {function} regenerateId - Function to generate a new random id.
   * @return {Promise} Resolves with random unique id.
   */
  static randomId(Model, { idRange, fill }) {
    // The ID consists of a random Integer (between idRange.bottom and
    // idRange.top) and "fill" (fill).
    // This generates IDs between fill+idRange.bottom and fill+idRange.top.

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getNewId() {
      return fill + getRandomInt(idRange.bottom, idRange.top);
    }

    function incrementId(lastId) {
      if (lastId >= fill + idRange.top) {
        return getNewId();
      }

      return lastId + 1;
    }

    const testId = getNewId();

    return Database.randomKey(Model, "id", testId, incrementId);
  }

  /**
   * Generate a new random and unique key.
   * @param  {Sequelize.Model} Model - A Model in sequelize.
   * @param  {String} key - Key in Model to check.
   * @param  {String/Number} firstValue - Start value.
   * @param  {function} genNextValue - Function to generate a new random key.
   * @return {Promise} Resolves with random unique key.
   */
  static randomKey(Model, key, firstValue, genNextValue) {
    return new Promise((resolve, reject) => {
      // In this async do-while loop, we search if the random ID already exists.
      // The loop exists if the ID is not found in the database (ID is unique).

      let isUnique;
      let currentValue = firstValue;

      async.doWhilst(
        // [async] Do this...
        callback => {
          // Find Instance by ID. If Instance is found (ID already exists),
          // increase the ID by 1. If the ID is the highest possible ID,
          // generate new random ID.
          // If ID is finally unique, break out of the loop.

          Model.findOne({ where: { [key]: currentValue } })
            .then(instance => {
              if (instance) {
                currentValue = genNextValue(currentValue);
                isUnique = false;
              } else {
                isUnique = true;
              }

              callback(null, currentValue);
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
        (ex, uniqueKey) => {
          if (ex) return reject(ex);
          return resolve(uniqueKey);
        }
      ); // end async.doWhilst
    }); // end Promise
  }
}

module.exports = Database;
