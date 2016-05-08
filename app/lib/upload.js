"use strict";

// Returns an instance of multer.
// Files are stored in /tmp/beam-uploads and everything other than an image
// gets rejected.

const multer = require("multer");

const storage = multer.diskStorage({
  destination: "/tmp/beam-uploads/"
});

const fileFilter = function fileFilter(req, file, next) {
  if (!file.mimetype.match(/^image\//)) {
    return next(new Error("File not supported"));
  }

  return next(null, true);
};

module.exports = multer({ storage, fileFilter });
