"use strict";

const Service = require("../../lib/service");
const UploadController = require("../controllers/upload-controller");

/** Service for Upload Routes */
module.exports =
class UploadService extends Service {
  /**
   * POST /uploads
   */
  post() {
    const { response } = this;

    const customTitle = this.body("title");
    UploadController.create(this.req.file, this.req.user, customTitle)
    .then(upload => {
      response
        .setSuccess()
        .putSingleData("upload", upload);
      return upload.getPerson();
    })
    .then(person => {
      response.putSingleData("person", person);
      return this.status(201).send();
    })
    .catch(ex => {
      this.next(ex);
    });
  }

  /**
   * DELETE /uploads/:uploadid
   */
  delete() {
    const { response } = this;


    // Find Upload by ID, check if it exists and belongs to authorized user,
    // then start the deletion.
    UploadController.byId(this.param("uploadid"))
    .then(upload => {
      if (!upload) {
        throw new Error("Upload not found");
      }
      if (upload.personId !== this.req.user.id) {
        throw new Error("Not allowed to perform action");
      }

      return UploadController.deleteById(this.param("uploadid"));
    })
    .then(() => {
      response.setSuccess();
      return this.send();
    })
    .catch(ex => {
      return this.next(ex);
    });
  }

  /**
   * GET /uploads
   * // TODO: Pagination / Sort / Limit / Header-Links
   */
  list() {
    const { response } = this;


    UploadController.findByUserId(
      this.req.user.id,
      { limit: 10, order: [["createdAt", "DESC"]] }
    )
    .then(uploads => {
      response.putListData("uploads", uploads);
      return this.send();
    });
  }
};
