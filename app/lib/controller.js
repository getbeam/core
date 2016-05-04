'use strict';

/** Controller for web requests */
class Controller {
  /**
   * Creates a controller.
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
   * Creates a new instance of the controller.
   *
   * Usage: MyController.call('methodName', arguments)
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
    this.res.json(data);
  }

  param(name) {
    return this.req.params[name];
  }
}

module.exports = Controller;
