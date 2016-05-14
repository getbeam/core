"use strict";

const Service = require("../../lib/service");
const UploadController = require("../controllers/upload-controller");

/** Service for Upload Routes */
class UploadService extends Service {
  /**
   * POST /uploads
   */
  post() {
    const customTitle = this.body("title");
    UploadController.create(this.req.file, this.req.user, customTitle)
    .then(upload => {
      this.status(201);
      this.jsonSuccess();
      this.jsonMainObject("uploads", upload.toJSON());
      return upload.getPerson();
    })
    .then(person => {
      this.jsonAddRelationship("person", "persons", person.toJSON());
      return this.send();
    })
    .catch(ex => {
      this.next(ex);
    });
  }

  /**
   * DELETE /uploads/:uploadid
   */
  delete() {
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
      this.jsonSuccess();
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
    UploadController.findByUserId(
      this.req.user.id,
      { limit: 10, order: [["createdAt", "DESC"]] }
    )
    .then(uploads => {
      uploads.forEach(upload => {
        this.jsonMainObjects("uploads", upload.toJSON());
      });
      return this.send();
    });
  }
}

module.exports = UploadService;
