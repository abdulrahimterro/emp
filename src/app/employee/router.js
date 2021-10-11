const controller = require("./controller");
const validator = require("./validator");
const { joiValidator, catchAsync, checkPermissions, multerUpload } = require("../../utils");
const router = require("express").Router();

// 1024 Byte => 1024 KB => 5 MB
const upload = multerUpload(1, 1024 * 1024 * 5, ["image/png", "image/jpeg"]);

/******************************
 * @Router /api/private/employee  *
 ******************************/

router.post("/", checkPermissions([1, 2, 3]), upload.single("image"), joiValidator(validator.create), catchAsync(controller.create));

router.patch("/:id", checkPermissions([1, 2, 3]), upload.single("image"), joiValidator(validator.update), catchAsync(controller.update));

router.delete("/:id", checkPermissions([1, 2, 3]), joiValidator(validator.paramId), catchAsync(controller.delete));

router.get("/:id", checkPermissions(), joiValidator(validator.paramId), catchAsync(controller.getById));

router.get("/", checkPermissions(), joiValidator(validator.getAll), catchAsync(controller.getAll));

module.exports = router;
