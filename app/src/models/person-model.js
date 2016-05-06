"use strict";

module.exports = function personModel(sequelize, DataTypes) {
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
  }, {
    classMethods: {
      associate: (models) => {
        Person.hasMany(models.Upload, {
          onDelete: "cascade",
          foreignKey: "personId"
        });
        Person.hasMany(models.LinkedAccount, {
          onDelete: "cascade",
          foreignKey: "personId"
        });
      }
    }
  });

  return Person;
};
