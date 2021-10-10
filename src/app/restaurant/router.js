const controller = require("./controller");
const validator = require("./validator");
const { joiValidator, catchAsync, checkPermissions } = require("../../utils");
const router = require("express").Router();
const { multerUpload } = require("../../utils");

const upload = multerUpload(1, 1024 * 1024 * 5, ["image/png", "image/jpeg"]);

/****************************************************
 * @SubRouter /api/private/restaurant/subscription  *
 ****************************************************/

router.use("/subscription", require("./subscriptions/router"));

/************************************
 * @Router /api/private/restaurant  *
 ************************************/

router.patch("/", checkPermissions([1, 2, 3]), upload.single("logo"), joiValidator(validator.update), catchAsync(controller.update));

router.get("/", checkPermissions(), joiValidator(validator.getAll), catchAsync(controller.getAll));

router.get("/:id", checkPermissions(), joiValidator(validator.paramId), catchAsync(controller.getById));

module.exports = router;
