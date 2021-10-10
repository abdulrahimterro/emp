const controller = require("./controller");
const validator = require("./validator");
const { joiValidator, catchAsync } = require("../../utils");
const router = require("express").Router();

/********************************
 * @Router /api/public/payment  *
 ********************************/

router.get("/paypal/success", catchAsync(controller.paypalSuccess));

router.get("/paypal/cancel", catchAsync(controller.paypalCancel));

module.exports = router;
