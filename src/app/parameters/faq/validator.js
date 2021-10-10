const Joi = require("joi");
const { commonValidators } = require("../../../utils");

module.exports = {
  paramId: commonValidators.paramId,

  create: Joi.object({
    body: Joi.object({
      enQuestion: Joi.string().required(),
      arQuestion: Joi.string().required(),
      enAnswer: Joi.string().required(),
      arAnswer: Joi.string().required(),
    }).required(),
  }),

  getAll: Joi.object({
    query: Joi.object({
      ...commonValidators.pagination,
    }).required(),
  }),
};
