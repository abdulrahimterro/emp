const router = require("express").Router();

router.use("/auth", require("./auth/publicRouter"));

router.use("/restaurant", require("./restaurant/publicRouter"));

router.use("/permission", require("./permission/publicRouter"));

router.use("/menu", require("./menu/publicRouter"));

router.use("/category", require("./category/publicRouter"));

router.use("/dish", require("./dish/publicRouter"));

router.use("/table", require("./table/publicRouter"));

router.use("/order", require("./order/publicRouter"));

router.use("/allergy", require("./allergy/publicRouter"));

router.use("/icon", require("./category/icon/publicRouter"));

router.use("/subscription", require("./subscription/publicRouter"));

router.use("/payment", require("./payment/publicRouter"));

router.use("/parameters", require("./parameters/publicRouter"));

module.exports = router;
