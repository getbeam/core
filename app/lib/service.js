"use strict";

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

  json(data) {
    return this.res.json(data);
  }

  param(name) {
    return this.req.params[name];
  }

  status(code) {
    return this.res.status(code);
  }

  body(name) {
    return this.req.body[name];
  }
}

module.exports = Service;
