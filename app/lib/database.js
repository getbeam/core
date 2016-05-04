'use strict';

const Sequelize = require('sequelize');
const Models = require('./models');

const sequelize = new Sequelize('beam', 'beam', 'securepassword', {
  host: 'localhost',
  dialect: 'postgres'
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
}

module.exports = Database;
