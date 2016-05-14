"use strict";

const fs = require("fs");
const zlib = require("zlib");
const Aws = require("aws-sdk");
const bucket = new Aws.S3({ params: { Bucket: "getbeam-test" } });

/** Controller for AWS Communication */
class AWSController {
  /**
   * Upload a file to S3 Bucket.
   * @param  {Object} obj - with values { path, mime, key }, where
   *                        path = local file path
   *                        mime = mimetype
   *                        key = key to save in bucket (remote filename)
   * @return {Promise} Resolves with uploaded file
   */
  static upload({ path, mime, key }) {
    const body = fs.createReadStream(path).pipe(zlib.createGzip());

    // TODO: Gzip or not?
    // TODO: How does AWS Encryption work? No way to check if files are really
    // encrypted.

    return new Promise((resolve, reject) => {
      bucket.upload({
        Body: body,
        ContentType: mime,
        Key: key,
        ServerSideEncryption: "AES256"
      }, (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(data);
      });
    });
  }

  /**
   * Delete a file form S3 Bucket.
   * @param  {String} key - Key of file in Bucket.
   * @return {Promise} Resolves when file was deleted.
   */
  static delete(key) {
    return new Promise((resolve, reject) => {
      bucket.deleteObject({
        Key: key
      }, (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
    });
  }
}

module.exports = AWSController;
