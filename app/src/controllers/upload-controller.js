"use strict";

const fs = require("fs");
const { Upload } = require("../../lib/database").models;
const { orm, randomId, randomKey } = require("../../lib/database");
const Randomstring = require("../../lib/randomstring");
const AWSController = require("./aws-controller");

/** Controller for Person Model */
class UploadController {
  /**
   * Create a new file in database and upload it to S3 Bucket.
   * @param  {Object} file - expressjs/multer file object.
   * @param  {Object} user - req.user
   * @param  {String} customTitle - Custom Title (optional).
   * @return {Promise} Resolves with created Instance.
   */
  static create(file, user, customTitle) {
    const idRange = { bottom: 0, top: 999999999999999 };
    const fill = 1000000000000000;

    // MAX_SAFE_INTEGER is:
    // 9007199254740991
    // So we can't _safely_ go higher than that.
    // That's why the highest ID for an Upload ID is set to:
    // 1999999999999999
    // 1205710364561829381
    // This is less than PostgreSQL's highest BIGINT:
    // 9223372036854775807
    // ... but it's something. Currently I don't want to use a BIGINT Library.

    return new Promise((resolve, reject) => {
      const shortkey = new Randomstring({
        length: 4,
        charset: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789"
      });

      function nextShortKey() {
        shortkey.shift();
        return shortkey.toString();
      }

      let uniqueShortKey;

      return randomKey(Upload, "shortKey", shortkey.toString(), nextShortKey)
      .then(genShortKey => {
        uniqueShortKey = genShortKey;
        return randomId(Upload, { idRange, fill });
      })
      .then(uniqueId => {
        let createdUpload;

        return orm.transaction()
        .then(transaction => {
          return Upload.create(
            Object.assign({}, {
              id: uniqueId,
              title: customTitle || file.originalname,
              shortKey: uniqueShortKey,
              personId: user.id,
              fileSize: file.size,
              mimetype: file.mimetype
            }),
            { transaction }
          )
          .then(newUpload => {
            createdUpload = newUpload;

            return AWSController.upload({
              path: file.path,
              mime: file.mimetype,
              key: newUpload.fileKey
            });
          })
          .then(() => {
            return transaction.commit();
          })
          .catch(ex => {
            transaction.rollback();
            throw new Error("Failed to upload file");
          });
        })
        .then(thing => {
          UploadController._deleteTmpFile(file.path);
          return resolve(createdUpload);
        })
        .catch(ex2 => {
          UploadController._deleteTmpFile(file.path);
          return reject(ex2);
        });
      });
    });
  }

  /**
   * Delete a file. Meant for async deleting of tmp-file after upload.
   * @param  {String} path - Absolute path to file.
   */
  static _deleteTmpFile(path) {
    fs.unlink(path, (err, bla) => {
      if (err) {
        console.log(`Failed to delete tmp file ${path} with error:`, err);
      }
    });
  }
}

module.exports = UploadController;
