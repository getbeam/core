"use strict";

module.exports = function authModel(sequelize, DataTypes) {
  const LinkedAccount = sequelize.define("LinkedAccount", {
    id: {
      type: DataTypes.UUID,
      unique: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    provider: {
      type: DataTypes.ENUM,
      values: ["google"],
      required: true,
    },
    foreignUserId: {
      type: DataTypes.STRING, // Postgres Integer types are max. signed BIGINT
      required: true          // but Google uses unsigned BIGINT. So... VARCHAR.
    }
  });

  return LinkedAccount;
};
