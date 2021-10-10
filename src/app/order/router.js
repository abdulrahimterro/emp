const controller = require("./controller");
const validator = require("./validator");
const { joiValidator, catchAsync, checkPermissions } = require("../../utils");
const router = require("express").Router();

/******************************
 * @Router /api/private/order *
 ******************************/

router.patch("/:id", checkPermissions([1, 2, 3, 4, 6]), joiValidator(validator.updateStatus), catchAsync(controller.update));

router.get("/status-count", checkPermissions(), joiValidator(validator.getStatusCount), catchAsync(controller.getStatusCount));

router.get("/", checkPermissions(), joiValidator(validator.getAll), catchAsync(controller.getAll));

router.get("/:id", checkPermissions(), joiValidator(validator.paramId), catchAsync(controller.getById));

module.exports = router;
