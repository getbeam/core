'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('beam', 'beam', 'securepassword', {
  host: 'localhost',
  dialect: 'postgres'
});
const db = exports;

db.sequelize = sequelize;


fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== 'db.js'))
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(model => {
  if ('associate' in db[model]) {
    db[model].associate(db);
  }
});

exports.Sequelize = Sequelize;
