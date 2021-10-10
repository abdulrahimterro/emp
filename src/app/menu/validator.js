const Joi = require("joi");
const { commonValidators } = require("../../utils");

module.exports = {
  paramId: commonValidators.paramId,

  create: Joi.object({
    body: Joi.object({
      enName: Joi.string().required(),
      arName: Joi.string().required(),
      currency: Joi.string().required(),
      location: Joi.string().required(),
      tablesCount: Joi.number().integer().min(0).max(100).required(),
    }).required(),
  }),

  update: Joi.object({
    params: Joi.object({
      id: Joi.number().required(),
    }).required(),
    body: Joi.object({
      enName: Joi.string(),
      arName: Joi.string(),
      currency: Joi.string(),
      location: Joi.string(),
      tablesCount: Joi.number().integer().min(0).max(100),
      image: Joi.string().valid("null"),
    }).required(),
  }),

  getAll: Joi.object({
    query: Joi.object({
      ...commonValidators.pagination,
      name: Joi.string(),
      restaurantId: Joi.number().integer().min(1),
    }),
  }),
};
