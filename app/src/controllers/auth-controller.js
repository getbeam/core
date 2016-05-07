"use strict";

const https = require("https");
const { LinkedAccount, Person } = require("../../lib/database").models;
const allowedClients = require("../allowed-clients");

/** Authentication and Authorization through external providers */
class AuthController {
  /**
   * Authorizes a Person with an external provider. The Client, through whom
   * the request was done, will also be authorized. The Person has to be in
   * the database. If all checks are successful, the next method in the request-
   * chain will be called.
   */
  static authorize() {
    return (req, res, next) => {
      const { provider, accessToken } = this._getCredentials(req);

      if (!provider) {
        return next(new Error("No provider given"));
      }
      if (!accessToken) {
        return next(new Error("No access token delivered"));
      }

      let authUserId;
      let authClientId;

      return this._callProvider({ provider, accessToken })
        .then(({ clientId, userId }) => {
          authUserId = userId;
          authClientId = clientId;
          return this._checkClient(authClientId);
        })
        .then(() => {
          return this._checkUser(authUserId, provider);
        })
        .then(person => {
          req.user = person;
          return next();
        })
        .catch(ex => {
          return next(ex);
        });
    };
  }

  /**
   * Authenticate a Person with an external provider. The Client, through whom
   * the request was done, will also be authorized. The Person DOESN'T need to
   * be in the database. If all checks are successful, the next method in the request-
   * chain will be called.
   */
  static authenticate() {
    return (req, res, next) => {
      const { provider, accessToken } = this._getCredentials(req);

      this._callProvider({ provider, accessToken })
        .then(({ clientId, userId }) => {
          req.auth_user_id = userId;
          req.auth_provider = provider;
          return this._checkClient(clientId);
        })
        .then(() => {
          return next();
        })
        .catch(ex => {
          return next(ex);
        });
    };
  }

  /**
   * Extract the provider and access_token from the request data.
   * @param  {Object} req - Express' request.
   * @return {Object} Object in form: { provider, accessToken }.
   */
  static _getCredentials(req) {
    const provider =
      req.get("X-Auth-Provider") || req.params.auth_provider;

    let accessToken =
      req.get("Authorization") || req.params.access_token;

    if (req.get("Authorization")) {
      accessToken = accessToken.replace("Bearer ", "");
    }

    return { provider, accessToken };
  }

  /**
   * Decide which authority to call in order to auth the Person. It also
   * calls the authority.
   * @param  {Object} { provider, accessToken }
   * @return {Promise} Promise from `this._callGoogle` or other autority.
   */
  static _callProvider({ provider, accessToken }) {
    switch (provider) {
      case "google":
        return this._callGoogle(accessToken);
      default:
        return Promise.reject();
    }
  }

  /**
   * Call Google authority (OAuth2.0) with transmitted access_token.
   * @param  {String} accessToken - access_token without "Bearer "
   * @return {Promise} Resolves with { clientId, userId }, where clientId is the
   *                   ID of the calling client and userId is the Google ID of
   *                   the user.
   */
  static _callGoogle(accessToken) {
    const host = "www.googleapis.com";
    const path = `/oauth2/v2/tokeninfo?access_token=${accessToken}`;

    return this._request({ host, path })
      .then(({ json, response }) => {
        if (response.statusCode === 400) {
          throw new Error("Invalid Google access_token");
        } else if (response.statusCode !== 200) {
          throw new Error("Misc Google Error");
        }

        const clientId = json.issued_to;
        const userId = json.user_id;

        return { clientId, userId };
      });
  }

  /**
   * Check if Client is known in the database.
   * // TODO: Maybe Database?
   * @param  {string} clientId - The ID of the client doing the request.
   * @return {Promise} Resolves when the client is known.
   */
  static _checkClient(clientId) {
    if (allowedClients.indexOf(clientId) > -1) {
      return Promise.resolve();
    }

    return Promise.reject(new Error("Client not allowed"));
  }

  /**
   * Check if Person is known in the database.
   * @param  {Integer} userId - ID of the user from the auth provider.
   * @param  {string} provider - Name of the provider.
   * @return {Promise} Resolves with the user.
   */
  static _checkUser(userId, provider) {
    return Person.findOne(
      {
        "LinkedAccounts.foreignUserId": userId,
        "LinkedAccounts.provider": provider
      }, {
        include: [LinkedAccount]
      }
    )
    .then(user => {
      if (!user) {
        throw new Error("you are not known ");
      }
      return user.toJSON();
    });
  }

  /**
   * Make a HTTPS request and return its data.
   * @param  {Object} { host, path }
   * @return {Promise} Resolves with { json, response } where `json` is the
   *                   received json-data and response is a node-https response.
   */
  static _request({ host, path }) {
    return new Promise((resolve, reject) => {
      https.get({ host, path }, response => {
        let body = "";
        return response
          .on("data", (d) => {
            body += d;
          })
          .on("end", () => {
            let json;
            try {
              json = JSON.parse(body);
            } catch (e) {
              return reject(e);
            }

            return resolve({ json, response });
          });
      });
    });
  }
}

module.exports = AuthController;
