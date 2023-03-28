const {
  fetchCategories,
} = require(`${__dirname}/../models/categories.model.js`);

exports.getCategories = (req, res, next) => {
  fetchCategories()
    .then((category) => {
      res.status(200).send({ categories: category });
    })
    .catch((err) => {
      next(err);
    });
};
