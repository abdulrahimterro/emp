const Joi = require("joi");

module.exports = {
  paramId: Joi.object({
    params: Joi.object({
      id: Joi.number().integer().min(1).required(),
    }).required(),
  }),

  pagination: {
    total: Joi.boolean(),
    offset: Joi.number().min(0),
    limit: Joi.number().min(1).max(200),
  },

  password: Joi.string().min(8).max(36).required(),

  order: (attributes = []) => ({
    order: Joi.array().items(
      Joi.array().ordered(
        Joi.string()
          .valid(...attributes)
          .required(),
        Joi.string().valid("desc", "asc").required()
      )
    ),
  }),

  idArray: Joi.alternatives().try(Joi.array().min(1).items(Joi.number().integer().min(1)), Joi.number().integer().min(1)),
};
