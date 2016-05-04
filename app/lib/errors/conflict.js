"use strict";

class ConflictError extends Error {
  constructor(message, key) {
    super(message);
    this.status = 409;
    this.key = key;
  }
}

module.exports = ConflictError;
