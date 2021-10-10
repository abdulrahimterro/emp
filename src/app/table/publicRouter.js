const controller = require("./controller");
const validator = require("./validator");
const { joiValidator, catchAsync } = require("../../utils");
const router = require("express").Router();

/******************************
 * @Router /api/public/table  *
 ******************************/

router.patch("/:id", joiValidator(validator.checkoutOrHelp), catchAsync(controller.update));

router.get("/:id/orders", joiValidator(validator.paramId), catchAsync(controller.getOrders));

router.get("/:code", joiValidator(validator.getByCode), catchAsync(controller.getByCode));

module.exports = router;
