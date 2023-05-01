const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const {
  getCategories,
} = require(`${__dirname}/controllers/categories.controller`);

const {
  getReviewById,
  getReviews,
  getCommentsByReviewId,
  postCommentByReviewId,
  patchVotesByReviewId,
} = require(`${__dirname}/controllers/reviews.controller`);

const {
  invalidPathError,
  customErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require(`${__dirname}/controllers/errorHandling.controller`);

const {
  deleteCommentByCommentId,
} = require(`${__dirname}/controllers/comments.controller`);

const { getUsers } = require(`${__dirname}/controllers/users.controller`);

const endpoints = require("./endpoints.json");

app.get("/api", (req, res) => {
  res.status(200).send(endpoints);
});

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.post("/api/reviews/:review_id/comments", postCommentByReviewId);

app.patch("/api/reviews/:review_id", patchVotesByReviewId);

app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

app.get("/api/users", getUsers);

app.get("/*", invalidPathError);

app.use(customErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

module.exports = app;
