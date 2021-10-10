const controller = require("./controller");
const { joiValidator, catchAsync } = require("../../utils");
const router = require("express").Router();
const validator = require("./validator");

/***********************************
 * @Router /api/public/parameters  *
 ***********************************/

router.get("/enums", catchAsync(controller.getEnums));

router.get("/errors", catchAsync(controller.getErrors));

router.post("/partners", joiValidator(validator.partners), catchAsync(controller.partners));

/***************************************
 * @Router /api/public/parameters/faq *
 ***************************************/

router.use("/faq", require("./faq/publicRouter"));

module.exports = router;
