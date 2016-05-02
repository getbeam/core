'use strict';

module.exports = function userModel(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    username: DataTypes.STRING
  });

  return User;
};
