"use strict";

module.exports = function uploadModel(sequelize, DataTypes) {
  const Upload = sequelize.define("Upload", {
    id: {
      type: DataTypes.BIGINT,
      unique: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING
    },
    fileKey: {
      type: DataTypes.UUID,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
      required: true
    },
    fileSize: {
      type: DataTypes.INTEGER,
      required: true
    },
    shortKey: {
      type: DataTypes.STRING,
      unique: true,
      required: true
    },
    mimetype: {
      type: DataTypes.STRING,
      required: true
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      required: true
    }
  }, {
    classMethods: {
      associate: (models) => {
        Upload.belongsTo(models.Person, { foreignKey: "personId" });
      }
    }
  });

  return Upload;
};
