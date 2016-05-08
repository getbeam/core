"use strict";

const Service = require("../../lib/service");
const UploadController = require("../controllers/upload-controller");

/** Service for Upload Routes */
class UploadService extends Service {
  post() {
    const customTitle = this.body("title");
    UploadController.create(this.req.file, this.req.user, customTitle)
    .then(upload => {
      this.jsonSuccess();
      this.jsonMainObject("uploads", upload.toJSON());
      this.send();
    })
    .catch(ex => {
      this.next(ex);
    });
  }
}

module.exports = UploadService;
