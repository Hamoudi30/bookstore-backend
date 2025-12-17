const { constants } = require("../helper/constants");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : constants.SERVER_ERROR;

  let title = "SERVER_ERROR";
  switch (statusCode) {
    case constants.VALIDATION_ERROR: title = "VALIDATION_ERROR"; break;
    case constants.NOT_FOUND: title = "NOT_FOUND"; break;
  }

  res.status(statusCode).json({
    title,
    message: err.message || "Something went wrong. Please try again later",
    stackTrace: err.stack,
  });
};

module.exports = errorHandler;