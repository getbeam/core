"use strict";

module.exports = function uploadModel(sequelize, DataTypes) {
  const Upload = sequelize.define("Upload", {
    id: {
      type: DataTypes.UUID,
      unique: true,
      primaryKey: true,
      defaultValue: DataTypes.UUID4
    },
    title: {
      type: DataTypes.STRING
    }
  }, {
    associate: (models) => {
      Upload.belongsTo(models.Person, {
        onDelete: "CASCADE",
        foreignKey: {
          allowNull: false
        }
      });
    }
  });

  return Upload;
};
