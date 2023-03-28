exports.invalidPathError = (req, res, next) => {
  res.status(404).send({ msg: "404 path not found" });
};
