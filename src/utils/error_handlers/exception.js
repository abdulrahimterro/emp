const errors = require("./errors");
const httpCodes = require("./http-codes");

class Exception {
  constructor({ httpStatus, code, msg, args = {} }) {
    this.httpStatus = httpStatus;
    this.code = code;
    this.message = msg;
    this.args = args;
  }

  static handler(err, req, res, next) {
    let httpStatus = err.httpStatus || httpCodes.INTERNAL_SERVER_ERROR;
    let code = err.code || httpCodes.INTERNAL_SERVER_ERROR;
    let message = err.code ? err.message : "Internal server error.";
    let args = err.args;

    //JSON parse errors
    if (err.type == "entity.parse.failed") {
      httpStatus = httpCodes.BAD_REQUEST;
      code = httpCodes.BAD_REQUEST;
      message = "JSON parsing error.";
    }

    // Database errors
    if (err.name == "SequelizeUniqueConstraintError") {
      httpStatus = errors.Database_Conflict.httpStatus;
      code = errors.Database_Conflict.code;
      message = errors.Database_Conflict.msg;
    }

    if (err.name == "SequelizeForeignKeyConstraintError") {
      httpStatus = errors.Database_Constraint.httpStatus;
      code = errors.Database_Constraint.code;
      message = errors.Database_Constraint.msg;
    }

    // JWT errors
    if (err.name == "TokenExpiredError") {
      httpStatus = errors.Token_Expired.httpStatus;
      code = errors.Token_Expired.code;
      message = errors.Token_Expired.msg;
    }

    if (err.name == "JsonWebTokenError") {
      httpStatus = errors.Invalid_Token.httpStatus;
      code = errors.Invalid_Token.code;
      message = errors.Invalid_Token.msg;
    }

    // Multer errors
    if (err.name === "MulterError") {
      httpStatus = errors.File_Upload_Failed.httpStatus;
      code = errors.File_Upload_Failed.code;
      message = errors.File_Upload_Failed.msg;

      if (err.message === "File too large") {
        httpStatus = errors.Large_File_Size.httpStatus;
        code = errors.Large_File_Size.code;
        message = errors.Large_File_Size.msg;
      }

      if (err.code === "LIMIT_FILE_COUNT") {
        httpStatus = errors.Too_Many_Files.httpStatus;
        code = errors.Too_Many_Files.code;
        message = errors.Too_Many_Files.msg;
      }
    }

    if (code == 500) console.error(err);
    res.status(httpStatus).json({ code, message, args });
  }
}

module.exports = Exception;
