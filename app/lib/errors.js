"use strict";

const Errors = exports;

Errors.ConflictError = class ConflictError extends Error {
  constructor(message, key) {
    super(message);
    this.status = 409;
    this.key = key;
  }
};

Errors.BadRequestError = class BadRequestError extends Error {
  constructor(message, validations) {
    super(message);
    this.status = 400;
    this.validations = validations;
  }
};

Errors.NotFoundError = class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = 404;
  }
};
