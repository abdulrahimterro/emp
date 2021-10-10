const controller = require("./controller");
const validator = require("./validator");
const { joiValidator, catchAsync, checkPermissions } = require("../../../utils");
const router = require("express").Router({ mergeParams: true });

/************************************************
 * @Router /api/private/restaurant/subscription *
 ************************************************/

router.get("/", checkPermissions([1]), joiValidator(validator.getAll), catchAsync(controller.getAll));

router.get("/:id", checkPermissions([1]), joiValidator(validator.paramId), catchAsync(controller.getById));

module.exports = router;
