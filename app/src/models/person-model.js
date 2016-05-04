"use strict";

module.exports = function userModel(sequelize, DataTypes) {
  const Person = sequelize.define("Person", {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true
    },
    displayName: {
      type: DataTypes.STRING
    },
    emailAddress: {
      type: DataTypes.STRING,
      unique: true
    }
  });

  return Person;
};
