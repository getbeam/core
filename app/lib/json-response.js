"use strict";

const humps = require("humps");
const schema = require("../src/schema-v1");

// TODO: Documentation

module.exports =
class JSONResponse {
  constructor() {
    this._json = {
      success: undefined,
      error: undefined,
      data: undefined,
      info: undefined
    };
  }

  setSuccess() {
    this._json.success = true;
    return this;
  }

  setError(err) {
    this._json.error = err;
    return this;
  }

  putSingleData(key, data) {
    this._prepareData();

    if (data && data.toJSON) {
      data = data.toJSON();
    }
    this._json.data[key] = data;
    return this;
  }

  putListData(key, data = []) {
    this._prepareData();

    if (data[0] && data[0].toJSON) {
      data = data.map(d => {
        return d.toJSON();
      });
    }
    this._json.data[key] = data;
    return this;
  }

  addToListData(key, data) {
    if (!(key in this._json.data)) {
      throw new Error("Key is not found");
    }
    this._json.data[key].push(data);
    return this;
  }

  toJSON() {
    const response = Object.assign({}, this._json);

    if (response.data) {
      Object.keys(response.data).forEach(key => {
        const data = response.data[key];

        if (schema.objectKeys[key].type === "list") {
          response.data[key] = data.map(d => {
            return this._schemaize(schema.objectKeys[key].of, d);
          });
        } else {
          response.data[key] = this._schemaize(key, data);
        }
      });
    }

    // "objectKeys" are already decamelized. This is mainly for errors/info
    // and as a last fallback.
    return humps.decamelizeKeys(response);
  }

  _schemaize(type, obj) {
    const keys = schema.objectKeys[type];
    const ret = {};
    keys.forEach(k => {
      ret[k.as] = obj[k.key];
    });

    return ret;
  }

  _prepareData() {
    if (!this._json.data) {
      this._json.data = {};
    }
  }
};
