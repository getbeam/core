"use strict";

const { NotFoundError } = require("../../lib/errors");

class ErrorHandler {
  constructor(err, req, res, next) {
    this.err = err;
    this.req = req;
    this.res = res;
    this.next = next;
    this._json = {};

    this._handle();
  }

  static call() {
    return (err, req, res, next) => {
      return new this(err, req, res, next);
    };
  }

  static pass404() {
    return (req, res, next) => {
      return next(new NotFoundError());
    };
  }

  _handle() {
    this._specifyError();
    return this.res.status(this._json.status).json({ error: this._json });
  }

  _specifyError() {
    this._json.status = this.err.status || 500;

    if (this.err.validations) {
      this._json.title = "Failed to validate request.";
      this._json.info = this.err.message;
      this._json.code = "BADVALIDATE";
      this._json.meta = this.err.validations;
    }

    this._json.__DEV__ = {};
    this._json.__DEV__.message = this.err.toString();
    this._json.__DEV__.data = this.err;
    this._json.__DEV__.stack = this.err.stack;
  }
}

module.exports = ErrorHandler;
