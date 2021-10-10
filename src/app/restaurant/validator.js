const Joi = require("joi");
const { commonValidators } = require("../../utils");

module.exports = {
  paramId: commonValidators.paramId,
  getAll: Joi.object({
    query: Joi.object({
      ...commonValidators.pagination,
      name: Joi.string(),
    }),
  }),

  signup: Joi.object({
    body: Joi.object({
      enName: Joi.string().required(),
      arName: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      password: commonValidators.password,
    }),
  }),

  update: Joi.object({
    body: Joi.object({
      enName: Joi.string(),
      arName: Joi.string(),
      logo: Joi.string().valid("null"),
    }).required(),
  }),
};
