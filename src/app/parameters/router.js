const controller = require("./controller");
const { catchAsync, checkPermissions } = require("../../utils");
const router = require("express").Router();

/***********************************
 * @Router /api/private/parameters *
 ***********************************/

router.get("/enums", checkPermissions(), catchAsync(controller.getEnums));

router.get("/errors", checkPermissions(), catchAsync(controller.getErrors));

/***************************************
 * @Router /api/private/parameters/faq *
 ***************************************/

router.use("/faq", require("./faq/router"));

module.exports = router;
