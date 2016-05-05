"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");

const routes = require("./routes-v1");
const ErrorHandler = require("./utils/error-handler");

const v1 = express();

v1.use(bodyParser.json());
v1.use(expressValidator());
v1.use("/", routes);
v1.use(ErrorHandler.pass404());
v1.use(ErrorHandler.call());

module.exports = v1;
