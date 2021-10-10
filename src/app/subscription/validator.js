const Joi = require("joi");
const { commonValidators } = require("../../utils");
const db = require("../../database").models;

module.exports = {
  paramId: commonValidators.paramId,

  create: Joi.object({
    body: Joi.object({
      name: Joi.string().required(),
      duration: Joi.number().required(),
      durationUnit: Joi.string().valid(..._.values(db.Subscription.UNITS)),
      price: Joi.number().required(),
      discount: Joi.number().required(),
      description: Joi.string().required(),
      arDescription: Joi.string().required(),
    }).required(),
  }),

  update: Joi.object({
    paramId: commonValidators.paramId,
    body: Joi.object({
      name: Joi.string(),
      duration: Joi.number().required(),
      durationUnit: Joi.string().valid(..._.values(db.Subscription.UNITS)),
      price: Joi.number(),
      discount: Joi.number(),
      description: Joi.string(),
      arDescription: Joi.string(),
    }).required(),
  }),

  getAll: Joi.object({
    query: Joi.object({
      ...commonValidators.pagination,
    }).required(),
  }),
};
