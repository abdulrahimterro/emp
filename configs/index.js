process.env.TZ = "UTC";
const configFile = require(`./${process.env.NODE_ENV || "development"}.json`);

const port = process.argv[2] || process.env.PORT || configFile.port;

module.exports = {
  ...configFile,
  nodeEnv: process.env.NODE_ENV || "development",
  port,
};
