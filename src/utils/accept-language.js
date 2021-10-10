const acceptLanguage = require("accept-language");
acceptLanguage.languages(["ar", "en"]);

module.exports = (req, res, next) => {
  req.language = acceptLanguage.get(req.headers["accept-language"] || req.headers["Accept-Language"]);
  next();
};
