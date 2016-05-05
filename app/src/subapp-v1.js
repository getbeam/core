const express = require("express");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");

const routes = require("./routes-v1");

const v1 = express();

v1.use(bodyParser.json());
v1.use(expressValidator());
v1.use("/", routes);

module.exports = v1;
