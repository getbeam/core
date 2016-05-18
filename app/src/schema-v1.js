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
      delete: [],
      list: []
    }
  },
  objectKeys: {
    uploads: { type: "list", of: "upload" },
    upload: [
      { key: "id", as: "id" },
      { key: "title", as: "title" },
      { key: "short_key", as: "short" },
      { key: "file_size", as: "file_size" },
      { key: "mimetype", as: "mimetype" },
      { key: "views", as: "views" },
      { key: "created_at", as: "created_at" }
    ],
    person: [
      { key: "id", as: "id" },
      { key: "display_name", as: "display_name" },
      { key: "email_address", as: "email_address" }
    ]
  }
};
