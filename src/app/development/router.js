const controller = require("./controller");
const validator = require("./validator");
const {
  joiValidator,
  catchAsync,
  checkPermissions,
  loggers: { logOptions, SuppressType },
} = require("../../utils");
const router = require("express").Router();

router.get("/", checkPermissions(), joiValidator(validator.logs), logOptions({ suppressType: SuppressType.All }), catchAsync(controller.getLogs));

module.exports = router;
