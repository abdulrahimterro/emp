const argv = require("args-parser")(process.argv);
const db = require("./index");
const _ = require("lodash");

db.sync({ logging: true, ..._.pick(argv, ["alter", "force"]) });
