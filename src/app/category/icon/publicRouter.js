const controller = require("./controller");
const validator = require("./validator");
const { joiValidator, catchAsync } = require("../../../utils");
const router = require("express").Router();

/*****************************
 * @Router /api/public/icon  *
 *****************************/

router.get("/:id", joiValidator(validator.paramId), catchAsync(controller.getById));

router.get("/", joiValidator(validator.getAll), catchAsync(controller.getAll));

module.exports = router;
