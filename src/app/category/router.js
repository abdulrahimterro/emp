const controller = require("./controller");
const validator = require("./validator");
const { joiValidator, catchAsync, checkPermissions } = require("../../utils");
const router = require("express").Router();

/**********************************
 * @Router /api/private/category  *
 **********************************/

router.post("/", checkPermissions([1, 2, 3]), joiValidator(validator.create), catchAsync(controller.create));

router.patch("/:id", checkPermissions([1, 2, 3]), joiValidator(validator.update), catchAsync(controller.update));

router.delete("/:id", checkPermissions([1, 2, 3]), joiValidator(validator.paramId), catchAsync(controller.delete));

router.get("/:id", checkPermissions(), joiValidator(validator.paramId), catchAsync(controller.getById));

router.get("/", checkPermissions(), joiValidator(validator.getAll), catchAsync(controller.getAll));

module.exports = router;
