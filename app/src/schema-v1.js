"use strict";

module.exports = {
  "persons/get": {
    id: {
      in: "params",
      isInt: {
        errorMessage: "Invalid ID"
      }
    }
  }
};
