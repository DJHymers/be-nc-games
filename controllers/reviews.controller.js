const { fetchReviewById } = require(`${__dirname}/../models/reviews.model.js`);

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
