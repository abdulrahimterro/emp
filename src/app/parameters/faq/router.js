const controller = require("./controller");
const validator = require("./validator");
const { joiValidator, catchAsync, checkPermissions } = require("../../../utils");
const router = require("express").Router({ mergeParams: true });

/*****************************
 * @Router /api/private/parameters/faq  *
 *****************************/

router.post("/", checkPermissions(), joiValidator(validator.create), catchAsync(controller.create));

router.delete("/:id", checkPermissions(), joiValidator(validator.paramId), catchAsync(controller.delete));

router.get("/:id", checkPermissions(), joiValidator(validator.paramId), catchAsync(controller.getById));

router.get("/", checkPermissions(), joiValidator(validator.getAll), catchAsync(controller.getAll));

module.exports = router;
