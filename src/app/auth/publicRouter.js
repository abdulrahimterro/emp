const controller = require("./controller");
const validator = require("./validator");
const { joiValidator, catchAsync } = require("../../utils");
const router = require("express").Router();

/*****************************
 * @Router /api/public/auth  *
 *****************************/

router.post("/login", joiValidator(validator.login), catchAsync(controller.login));

router.post("/refresh-token", joiValidator(validator.refreshToken), catchAsync(controller.refreshToken));

router.post("/signup", joiValidator(validator.signup), catchAsync(controller.signup));

router.post("/forget-password", joiValidator(validator.forgetPassword), catchAsync(controller.forgetPassword));

router.post("/reset-password", joiValidator(validator.resetPassword), catchAsync(controller.resetPassword));

router.patch("/verify", joiValidator(validator.verify), catchAsync(controller.verify));

module.exports = router;
