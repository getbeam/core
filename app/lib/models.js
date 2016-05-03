'use strict';

const path = require('path');

/** Utility Class for Model Management */
class Models {
  /**
   * Create and initialize sequelize models.
   * @param  {Object} sequelize - The sequelize instance
   * @return {Object} All models { ModelA: modelA, ModelB: modelB}
   */
  constructor(sequelize) {
    const models = {};
    const forbiddenModelNames = [
      'sequelize'
    ];
    const modelPaths = this._fullModelPaths([
      'person'
    ]);

    modelPaths.forEach(p => {
      const model = sequelize.import(p);

      if (forbiddenModelNames.indexOf(model.name) > -1) {
        throw new Error(`Model name '${model.name}' is not allowed`);
      }

      models[model.name] = model;
    });

    // Create model associations
    Object.keys(models).forEach(modelName => {
      if ('associate' in models[modelName]) {
        models[modelName].associate(models);
      }
    });

    return models;
  }

  /**
   * Prepends model directory in front of string.
   * @param  {Array} paths - Filenames in models directory.
   * @return {Array} model directory with file name.
   */
  _fullModelPaths(paths) {
    const MODELS_DIRECTORY = path.resolve(__dirname, '..', 'models');
    return paths.map(p => path.join(MODELS_DIRECTORY, p));
  }
}

module.exports = Models;
