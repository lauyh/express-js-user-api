const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(express.json()); // parse json for post request
app.use(express.urlencoded({ extended: true }));

// logger
morgan(":method :url :status :res[content-length] - :response-time ms");
app.use(morgan());

module.exports = app;
