const controller = require("./controller");
const validator = require("./validator");
const { joiValidator, catchAsync, checkPermissions } = require("../../utils");
const router = require("express").Router();

/**************************************
 * @Router /api/private/subscription  *
 **************************************/

router.get("/:id", checkPermissions(), joiValidator(validator.paramId), catchAsync(controller.getById));

router.get("/", checkPermissions(), joiValidator(validator.getAll), catchAsync(controller.getAll));

module.exports = router;
