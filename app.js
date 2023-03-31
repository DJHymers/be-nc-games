const express = require("express");
const app = express();
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

app.get("/api", (req, res) => {
  res.status(200).send({ msg: "All good!" });
});

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.post("/api/reviews/:review_id/comments", postCommentByReviewId);

app.patch("/api/reviews/:review_id", patchVotesByReviewId);

app.get("/*", invalidPathError);

app.use(customErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

module.exports = app;
