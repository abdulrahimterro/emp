const Joi = require("joi");
const { commonValidators } = require("../../utils");

module.exports = {
  paramId: commonValidators.paramId,

  stripe: Joi.object({
    query: Joi.object({
      subscriptionId: Joi.number().integer().min(2).required(),
    }),
  }),

  paypal: Joi.object({
    query: Joi.object({
      subscriptionId: Joi.number().integer().min(2).required(),
    }),
  }),
};
