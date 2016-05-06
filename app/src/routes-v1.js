"use strict";

const { Router } = require("express");
const PersonService = require("./services/person-service");
const Validation = require("./utils/validation");
const AuthController = require("./controllers/auth-controller");

// eslint-disable-next-line new-cap
const routes = Router();

routes.get("/persons/me",
  AuthController.authorize(),
  // Validation.validate("persons/get", "v1"),
  PersonService.call("get")
);
routes.post("/persons",
  AuthController.authenticate(),
  PersonService.call("post")
);
routes.patch("/persons/me",
  AuthController.authorize(),
  PersonService.call("patch")
);
routes.delete("/persons/me",
  AuthController.authorize(),
  PersonService.call("delete")
);

module.exports = routes;
