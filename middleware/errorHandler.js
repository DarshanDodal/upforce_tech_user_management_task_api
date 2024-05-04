// errorHandler.js

module.exports = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ success: false, error: err.stack });
};