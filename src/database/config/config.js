const {
  database: { sequelize },
  nodeEnv,
} = require("../../../configs");

module.exports = {
  [nodeEnv]: sequelize,
};
