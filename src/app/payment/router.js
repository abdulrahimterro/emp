const controller = require("./controller");
const validator = require("./validator");
const { joiValidator, catchAsync, checkPermissions } = require("../../utils");

const router = require("express").Router();

/*********************************
 * @Router /api/private/payment  *
 *********************************/

router.post("/stripe", checkPermissions([1]), joiValidator(validator.stripe), catchAsync(controller.stripe));

router.post("/paypal", checkPermissions([1]), joiValidator(validator.paypal), catchAsync(controller.paypalPay));

module.exports = router;
