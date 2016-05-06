"use strict";

const { Router } = require("express");
const PersonService = require("./services/person-service");
const Validation = require("./utils/validation");
const AuthController = require("./controllers/auth-controller");

// eslint-disable-next-line new-cap
const routes = Router();

routes.get("/persons/:id",
  AuthController.authorize(),
  Validation.validate("persons/get", "v1"),
  PersonService.call("get")
);
routes.post("/persons",
  PersonService.call("post")
);
routes.delete("/persons/:id",
  PersonService.call("delete")
);

module.exports = routes;
