const express = require("express");
const app = express();
const {
  getCategories,
} = require(`${__dirname}/controllers/categories.controller`);
const {
  invalidPathError,
} = require(`${__dirname}/controllers/errorHandling.controller`);

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ msg: "All good!" });
});

app.get("/api/categories", getCategories);

app.get("/*", invalidPathError);

module.exports = app;
