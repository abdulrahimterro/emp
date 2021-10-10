const controller = require("./controller");
const validator = require("./validator");
const { joiValidator, catchAsync, checkPermissions, multerUpload } = require("../../utils");
const router = require("express").Router();

const upload = multerUpload(1, 1024 * 1024 * 5, ["image/png", "image/jpeg"]);

/**********************
 * @Router /api/user  *
 **********************/

router.get("/profile", checkPermissions(), catchAsync(controller.getProfile));

router.patch("/profile", checkPermissions(), upload.single("avatar"), joiValidator(validator.updateProfile), catchAsync(controller.updateProfile));

router.post("/resend-verification", checkPermissions(), catchAsync(controller.resendVerification));

/*****************
 * Owner & manager routes  *
 *****************/

router.post("/invite", checkPermissions([1, 2]), joiValidator(validator.invite), catchAsync(controller.invite));

router.get("/", checkPermissions([1, 2]), joiValidator(validator.getAll), catchAsync(controller.getAll));

router.get("/:id", checkPermissions([1, 2]), joiValidator(validator.paramId), catchAsync(controller.getById));

router.patch("/:id", checkPermissions([1, 2]), joiValidator(validator.update), catchAsync(controller.update));

module.exports = router;
