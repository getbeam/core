"use strict";

module.exports = {
  PersonService: {
    allowedKeys: {
      patch: ["display_name", "email_address"],
      post: ["display_name", "email_address"],
      get: [],
      delete: []
    }
  },
  UploadService: {
    allowedKeys: {
      post: ["title"],
      delete: []
    }
  }
};
