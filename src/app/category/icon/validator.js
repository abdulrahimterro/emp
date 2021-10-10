const Joi = require("joi");
const { commonValidators } = require("../../../utils");

module.exports = {
  paramId: commonValidators.paramId,

  getAll: Joi.object({
    query: Joi.object({
      ...commonValidators.pagination,
    }).required(),
  }),
};
