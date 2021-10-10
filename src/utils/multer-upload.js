const multer = require("multer");
const errors = require("./error_handlers/errors");
const Exception = require("./error_handlers/exception");

module.exports = (fieldsCount, fileSize, allowedTypes) =>
  multer({
    limits: { files: fieldsCount, fileSize },
    fileFilter: (req, file, cb) => {
      if (!allowedTypes.includes(file.mimetype)) {
        cb(new Exception(errors.Not_Supported_File_Type));
      }
      cb(null, true);
    },
  });
