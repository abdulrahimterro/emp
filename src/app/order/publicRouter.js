const controller = require("./controller");
const validator = require("./validator");
const { joiValidator, catchAsync } = require("../../utils");
const router = require("express").Router();

/******************************
 * @Router /api/public/order  *
 ******************************/

router.post("/", joiValidator(validator.create), catchAsync(controller.create));

router.patch("/:id", joiValidator(validator.update), catchAsync(controller.update));

module.exports = router;
