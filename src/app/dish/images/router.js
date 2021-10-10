const controller = require("./controller");
const validator = require("./validator");
const { joiValidator, catchAsync, checkPermissions } = require("../../../utils");
const router = require("express").Router({ mergeParams: true });

/****************************************
 * @Router /api/private/dish/:id/image  *
 ****************************************/

router.delete("/:imageId", checkPermissions([1, 2, 3]), joiValidator(validator.paramIdImageId), catchAsync(controller.delete));

router.patch("/:imageId", checkPermissions([1, 2, 3]), joiValidator(validator.paramIdImageId), catchAsync(controller.defaultImage));

module.exports = router;
