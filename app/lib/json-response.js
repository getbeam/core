"use strict";

class JSONResponse {
  constructor() {
    this._json = {
      data: undefined,
      errors: undefined,
      meta: undefined
    };
  }

  setDataAsList() {
    this._json.data = [];
    return this;
  }

  setDataAsSingle() {
    this._json.data = {};
    return this;
  }

  setData(jsonData) {
    this._json.data = jsonData;
    return this;
  }

  addData(jsonData) {
    this._json.data.push(jsonData);
    return this;
  }

  addMeta(metaObj) {
    if (!this._json.meta) {
      this._json.meta = [];
    }

    this._json.meta.push(metaObj);
    return this;
  }

  addError(errorObj) {
    if (!this._json.errors) {
      this._json.errors = [];
    }

    this._json.errors.push(errorObj);
    return this;
  }

  toJSON() {
    return this._json;
  }
}

module.exports = JSONResponse;
