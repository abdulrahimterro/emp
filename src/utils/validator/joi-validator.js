const httpCodes = require("../error_handlers/http-codes");
const Exception = require("../error_handlers/exception");

module.exports = (schema) => (req, res, next) => {
  const validationResult = schema.options({ abortEarly: false }).unknown(true).validate(req);

  if (validationResult.error) {
    const errors = validationResult.error.details.map((val) => val.message.split('"').join(""));
    throw new Exception({
      httpStatus: httpCodes.BAD_REQUEST,
      code: "418",
      msg: "Validation error.",
      args: errors,
    });
  }
  next();
};
