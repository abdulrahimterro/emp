const controller = require("./controller");
const validator = require("./validator");
const { catchAsync, checkPermissions } = require("../../utils");
const router = require("express").Router();

/************************************
 * @Router /api/private/permission  *
 ************************************/

router.get("/", checkPermissions(), catchAsync(controller.getAll));

module.exports = router;
