global._ = require("lodash");

const logger = require("./logger/console");

console.log = function () {
  return logger.info.apply(logger, arguments);
};
console.info = function () {
  return logger.info.apply(logger, arguments);
};
console.warn = function () {
  return logger.warn.apply(logger, arguments);
};
console.debug = function () {
  return logger.debug.apply(logger, arguments);
};
console.error = function () {
  return logger.error.apply(logger, arguments);
};

module.exports = {
  ...require("./error_handlers"),

  loggers: {
    createFileLogger: require("./logger/fileLogger"),
    createHttpLogger: require("./logger/httpLogger"),
    ...require("./logger/logOptions"),
  },

  JWTGenerator: require("./jwt-generator"),

  mailSender: require("./mail-sender"),

  moment: require("moment"),

  getPagination: require("./pagination"),

  createAssetsDir: require("./create-assets-dir"),

  multerUpload: require("./multer-upload"),

  acceptLanguage: require("./accept-language"),

  checkPermissions: require("./check-permissions"),

  joiValidator: require("./validator/joi-validator"),

  commonValidators: require("./validator/common"),

  fileUtil: require("./files"),
};
