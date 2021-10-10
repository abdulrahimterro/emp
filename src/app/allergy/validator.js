const Joi = require("joi");
const { commonValidators } = require("../../utils");
const sequelize = require("../../database");

module.exports = {
  paramId: commonValidators.paramId,
  getAll: Joi.object({
    query: Joi.object({
      ...commonValidators.pagination,
      name: Joi.string(),
    }),
  }),
};
