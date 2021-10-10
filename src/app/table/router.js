const controller = require("./controller");
const validator = require("./validator");
const { joiValidator, catchAsync, checkPermissions } = require("../../utils");
const router = require("express").Router();

/*******************************
 * @Router /api/private/table  *
 *******************************/

router.patch("/:id", checkPermissions(), joiValidator(validator.update), catchAsync(controller.update));

router.get("/", checkPermissions(), joiValidator(validator.getAll), catchAsync(controller.getAll));

module.exports = router;
