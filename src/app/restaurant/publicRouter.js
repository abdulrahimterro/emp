const controller = require("./controller");
const validator = require("./validator");
const { joiValidator, catchAsync } = require("../../utils");
const router = require("express").Router();
const { multerUpload } = require("../../utils");

const upload = multerUpload(1, 1024 * 1024 * 5, ["image/png", "image/jpeg"]);

/***********************************
 * @Router /api/public/restaurant  *
 ***********************************/

router.post("/", upload.single("logo"), joiValidator(validator.signup), catchAsync(controller.signup));

router.get("/", joiValidator(validator.getAll), catchAsync(controller.getAll));

router.get("/:id", joiValidator(validator.paramId), catchAsync(controller.getById));

module.exports = router;
