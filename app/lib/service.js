"use strict";

const humps = require("humps");
const schema = require("../src/schema-v1");

/** Service Class for web requests */
class Service {
  /**
   * Creates a service.
   * @param  {Object} req - Express' request Object
   * @param  {Object} res - Express' response Object
   * @param  {Function} next Express' next Function
   */
  constructor(req, res, next, calledMethod) {
    this.req = req;
    this.res = res;
    this.next = next;
    this._calledMethod = calledMethod;
    this._result = {};
    this.req.body = this._cleanBody();
    this.camelBody = humps.camelizeKeys(this.req.body);
  }

  /**
   * Creates a new instance of the Service.
   *
   * Usage: MyService.call('methodName', arguments)
   * @param  {string} methodName - Method name to call after instantiation.
   * @param  {arguments} ...args - More arguments to pass to callee.
   * @return {Function} Anonymous function returning new instance.
   */
  static call(methodName, ...args) {
    return (req, res, next) => {
      new this(req, res, next, methodName)[methodName](args);
    };
  }

  /**
   * Loops over allowed keys for the request body of the called method
   * and generates a new object with those keys. Used to clean up the body
   * to prevent exploits.
   * @return {Object} The cleaned body object.
   */
  _cleanBody() {
    const cleanedBody = {};
    const serviceName = this.constructor.name;
    const method = this._calledMethod;
    const methodKeys = schema[serviceName].allowedKeys[method];
    methodKeys.forEach(key => {
      if (this.req.body[key]) {
        cleanedBody[key] = this.req.body[key];
      }
    });

    const disallowedKeys = Object.keys(this.req.body).filter(keyInOrig => {
      return methodKeys.indexOf(keyInOrig) < 0;
    });

    disallowedKeys.forEach(disallowedKey => {
      this.jsonAddMeta(
        "PARAMIGNORE",
        `The key \`${disallowedKey}\` is not known and thus was neglected.`);
    });

    return cleanedBody;
  }

  _jsonObject(type, data) {
    let includes = false;

    // parse "include" in query string
    if (
      this.req.query.include &&
      this.req.query.include[type] &&
      typeof this.req.query.include[type] === "string"
    ) {
      includes = this.req.query.include[type].split(",");
    }

    // Prepare jsonObject
    const obj = {};
    obj.type = type;
    obj.id = data.id;

    // Prepare the attributes output.
    // Only put in attributes those keys that are defined in the schema.
    const attributes = {};
    schema.objectKeys[type].forEach(key => {
      let keyobj = key;
      // the key can be a object { key, as } or a string. The string is a
      // represenation of { key: string, as: string }.
      if (typeof keyobj === "string") {
        keyobj = { key, as: key };
      }

      // Also, check if includes is set and output only includes
      if ((includes && includes.indexOf(keyobj.as) > -1) || !includes) {
        attributes[keyobj.as] = data[humps.camelize(keyobj.key)];
      }
    });

    obj.attributes = attributes;
    return obj;
  }

  jsonMainObject(type, data) {
    const obj = this._jsonObject(type, data);
    this._result.data = obj;
    return this;
  }

  jsonAddRelationship(key, type, data) {
    const obj = this._jsonObject(type, data);
    const rel = this._result.data.relationships || {};
    rel[key] = obj;
    this._result.data.relationships = rel;
    return this;
  }

  jsonAddMeta(code, info) {
    this._result.meta = this._result.meta || [];
    this._result.meta.push({ code, info });
  }

  json(data) {
    return this.res.json(humps.decamelizeKeys(data));
  }

  send() {
    const sortedObject = {
      success: this._result.success,
      data: this._result.data,
      meta: this._result.meta
    };
    return this.json(sortedObject);
  }

  jsonSuccess() {
    this._result.success = true;
    return this;
  }

  param(name) {
    return this.req.params[name];
  }

  status(code) {
    this.res.status(code);
    return this;
  }

  body(key) {
    if (!key) {
      return this.camelBody;
    }

    return this.camelBody[key];
  }

  sanitize(key, where = "all") {
    switch (where) {
      case "all":
        return this.req.sanitize(key);
      case "body":
        return this.req.sanitizeBody(key);
      case "query":
        return this.req.sanitizeQuery(key);
      case "param":
        return this.req.sanitizeParams(key);
      case "header":
        return this.req.sanitizeHeaders(key);
      default:
        return this.req.sanitize(key);
    }
  }
}

module.exports = Service;
