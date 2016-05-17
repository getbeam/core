"use strict";

class JSONData {
  constructor({ type, id, attributes, relationships }) {
    this._data = {
      type,
      id,
      attributes,
      relationships
    };
  }

  setType(type) {
    this._data.type = type;
    return this;
  }

  setId(id) {
    this._data.id = id;
    return this;
  }

  setAttributes(attributes) {
    this._data.attributes = attributes;
    return this;
  }

  setRelationships(relationships) {
    this._data.relationships = relationships;
    return this;
  }

  toJSON() {
    return this._data;
  }
}

module.exports = JSONData;
