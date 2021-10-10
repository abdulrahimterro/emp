const router = require("express").Router();

// authorization
router.use(require("./auth/controller").authorization);

router.use("/dev-logs", require("./development/router"));

router.use("/restaurant", require("./restaurant/router"));

router.use("/user", require("./user/router"));

router.use("/permission", require("./permission/router"));

router.use("/menu", require("./menu/router"));

router.use("/category", require("./category/router"));

router.use("/dish", require("./dish/router"));

router.use("/table", require("./table/router"));

router.use("/client", require("./client/router"));

router.use("/order", require("./order/router"));

router.use("/allergy", require("./allergy/router"));

router.use("/icon", require("./category/icon/router"));

router.use("/subscription", require("./subscription/router"));

router.use("/payment", require("./payment/router"));

router.use("/parameters", require("./parameters/router"));

module.exports = router;
