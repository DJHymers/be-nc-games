const {
  fetchReviewById,
  fetchReviews,
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
  console.log(sort_by);
  fetchReviews(sort_by, order)
    .then((reviews) => {
      res.status(200).send({ reviews: reviews });
    })
    .catch((err) => {
      next(err);
    });
};
