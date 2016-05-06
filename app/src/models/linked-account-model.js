"use strict";

module.exports = function authModel(sequelize, DataTypes) {
  const LinkedAccount = sequelize.define("LinkedAccount", {
    id: {
      type: DataTypes.UUID,
      unique: true,
      primaryKey: true,
      defaultValue: DataTypes.UUID4
    },
    provider: {
      type: DataTypes.ENUM,
      values: ["google"],
      required: true,
    },
    foreignUserId: {
      type: DataTypes.BIGINT,
      required: true
    }
  }, {
    classMethods: {
      associate: (models) => {
        LinkedAccount.belongsTo(models.Person, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });

  return LinkedAccount;
};
