"use strict";

const humps = require("humps");

/** Service Class for web requests */
class Service {
  /**
   * Creates a service.
   * @param  {Object} req - Express' request Object
   * @param  {Object} res - Express' response Object
   * @param  {Function} next Express' next Function
   */
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
    this._result = {};
    this.camelBody = humps.camelizeKeys(req.body);
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
      new this(req, res, next)[methodName](args);
    };
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

    // Prepare json object
    const obj = {};
    const copyData = Object.assign({}, data);
    delete copyData.id;
    obj.type = type;
    obj.id = data.id;

    // Filter included keys, if necessary
    if (includes) {
      obj.attributes = {};
      includes.forEach(key => {
        if (copyData[key]) {
          obj.attributes[key] = copyData[key];
        }
      });
    } else {
      obj.attributes = copyData;
    }

    return obj;
  }

  jsonMainObject(type, data) {
    const obj = this._jsonObject(type, data);
    this._result.data = Object.assign({}, obj);
    return this;
  }

  json(data) {
    return this.res.json(humps.decamelizeKeys(data));
  }

  send() {
    return this.json(this._result);
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
}

module.exports = Service;
