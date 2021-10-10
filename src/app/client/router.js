const controller = require("./controller");
const validator = require("./validator");
const { joiValidator, catchAsync, checkPermissions } = require("../../utils");
const router = require("express").Router();

/********************************
 * @Router /api/private/client  *
 ********************************/

router.get("/", checkPermissions(), joiValidator(validator.getAll), catchAsync(controller.getAll));

router.get("/:id", checkPermissions(), joiValidator(validator.paramId), catchAsync(controller.getById));

module.exports = router;
