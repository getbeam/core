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
      { key: "shortKey", as: "short" },
      { key: "fileSize", as: "file_size" },
      { key: "mimetype", as: "mimetype" },
      { key: "views", as: "views" },
      { key: "createdAt", as: "created_at" }
    ],
    person: [
      { key: "id", as: "id" },
      { key: "displayName", as: "display_name" },
      { key: "emailAddress", as: "email_address" }
    ]
  }
};
