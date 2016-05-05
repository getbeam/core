"use strict";

const { BadRequestError } = require("../../lib/errors");
const schemas = {};
schemas.v1 = require("../schema-v1");

/** Validation Class as Middleware */
class Validation {
  /**
   * Validate the request.
   * @param  {String} identifier - The identifier to check against the schema.
   * @param  {String} version - Schema version number.
   */
  static validate(identifier, version) {
    return (req, res, next) => {
      req.check(schemas[version][identifier]);
      const errors = req.validationErrors();

      if (errors) {
        return next(new BadRequestError("Request is invalid.", errors));
      }

      return next();
    };
  }
}

module.exports = Validation;
