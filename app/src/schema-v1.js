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
  },
  objectKeys: {
    uploads: [
      "title",
      { key: "short_key", as: "short" },
      "file_size",
      "mimetype",
      "views"
    ],
    persons: [
      "display_name",
      "email_address"
    ]
  }
};
