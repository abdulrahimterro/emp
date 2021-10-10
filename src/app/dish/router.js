const controller = require("./controller");
const validator = require("./validator");
const { joiValidator, catchAsync, checkPermissions, multerUpload } = require("../../utils");

const router = require("express").Router();

// 1024 Byte => 1024 KB => 5 MB
const upload = multerUpload(4, 1024 * 1024 * 5, ["image/png", "image/jpeg"]);

/******************************
 * @Router /api/private/dish  *
 ******************************/

router.post("/", checkPermissions([1, 2, 3]), upload.array("images"), joiValidator(validator.create), catchAsync(controller.create));

router.patch(
  "/:id",
  checkPermissions([1, 2, 3, 4]),
  upload.array("images", 4),
  (req, res, next) => {
    const isChef = req.user.permissions.find((val) => val.id === 4);
    if (isChef && req.user.permissions.length === 1) joiValidator(validator.changeStatus)(req, res, () => {});
    else joiValidator(validator.update)(req, res, () => {});
    next();
  },
  catchAsync(controller.update)
);

router.delete("/:id", checkPermissions([1, 2, 3]), joiValidator(validator.paramId), catchAsync(controller.delete));

router.get("/:id", checkPermissions(), joiValidator(validator.paramId), catchAsync(controller.getById));

router.get("/", checkPermissions(), joiValidator(validator.getAll), catchAsync(controller.getAll));

/*******************************************
 * @SubRouter /api/private/dish/:id/image  *
 *******************************************/

router.use("/:id/image", require("./images/router"));

module.exports = router;
