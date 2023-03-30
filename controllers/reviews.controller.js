const {
  fetchReviewById,
  fetchReviews,
  fetchCommentsByReviewId,
  insertCommentByReviewId,
} = require(`${__dirname}/../models/reviews.model.js`);

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewById(review_id)
    .then((review) => {
      res.status(200).send({ reviews: review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
  const { sort_by, order } = req.query;
  fetchReviews(sort_by, order)
    .then((reviews) => {
      res.status(200).send({ reviews: reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  const { sort_by, order } = req.query;
  fetchCommentsByReviewId(review_id, sort_by, order)
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  const { username, body } = req.body;
  insertCommentByReviewId(review_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment: comment });
    })
    .catch((err) => {
      next(err);
    });
};
