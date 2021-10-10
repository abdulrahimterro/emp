const httpCodes = require("./http-codes");
const statusCodes = require("./status-codes");
const models = {
  database: "01",
  auth: "02",
  multer: "03",
};

module.exports = {
  // Auth errors
  Token_Expired: {
    httpStatus: httpCodes.UNAUTHORIZED,
    code: models.auth + statusCodes.INVALID_OPERATION + "01",
    msg: "Authorization Token expired.",
  },
  Invalid_Token: {
    httpStatus: httpCodes.UNAUTHORIZED,
    code: models.auth + statusCodes.INVALID_OPERATION + "02",
    msg: "Invalid authorization token.",
  },
  Unauthorized: {
    httpStatus: httpCodes.UNAUTHORIZED,
    code: models.auth + statusCodes.INVALID_OPERATION + "03",
    msg: "Unauthorized.",
  },
  Email_Not_Found: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.auth + statusCodes.ITEM_NOT_FOUND + "01",
    msg: "Email not found.",
  },
  Invalid_Password: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.auth + statusCodes.INVALID_OPERATION + "04",
    msg: "Invalid password.",
  },
  ResetPassword_Token_Not_found: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.auth + statusCodes.ITEM_NOT_FOUND + "02",
    msg: "Reset password token not found.",
  },
  Email_VerifyCode_Not_found: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.auth + statusCodes.ITEM_NOT_FOUND + "03",
    msg: "Email verify code not found.",
  },
  // Multer errors
  Not_Supported_File_Type: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.multer + statusCodes.INVALID_OPERATION + "01",
    msg: "Not supported file type.",
  },
  File_Upload_Failed: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.multer + statusCodes.INVALID_OPERATION + "02",
    msg: "Error uploading file.",
  },
  Large_File_Size: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.multer + statusCodes.INVALID_OPERATION + "03",
    msg: "File size is too large.",
  },
  Too_Many_Files: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.multer + statusCodes.INVALID_OPERATION + "04",
    msg: "Exceeded max files count limit.",
  },
  // Database errors
  Database_Conflict: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.database + statusCodes.INVALID_OPERATION + "01",
    msg: "Conflict.",
  },
  Database_Constraint: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.database + statusCodes.INVALID_OPERATION + "02",
    msg: "Reference non existing data.",
  },
};
