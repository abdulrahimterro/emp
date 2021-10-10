const Joi = require("joi");
const { commonValidators } = require("../../utils");
const db = require("../../database").models;

module.exports = {
  paramId: commonValidators.paramId,

  create: Joi.object({
    body: Joi.object({
      menuId: Joi.number().required(),
      enName: Joi.string().required(),
      arName: Joi.string().required(),
      status: Joi.string().valid(..._.values(db.Category.STATUS)),
      iconId: Joi.number().required(),
    }).required(),
  }),

  update: Joi.object({
    params: Joi.object({
      id: Joi.number().required(),
    }).required(),
    body: Joi.object({
      enName: Joi.string(),
      arName: Joi.string(),
      iconId: Joi.number(),
      status: Joi.string().valid(..._.values(db.Category.STATUS)),
    }).required(),
  }),

  getAll: Joi.object({
    query: Joi.object({
      ...commonValidators.pagination,
      menuId: Joi.number().required(),
      name: Joi.string(),
      status: Joi.alternatives().try(
        Joi.array().items(Joi.string().valid(..._.values(db.Category.STATUS))),
        Joi.string().valid(..._.values(db.Category.STATUS))
      ),
    }),
  }),

  getById: Joi.object({
    params: Joi.object({
      id: Joi.number().required(),
    }).required(),
    query: Joi.object({
      limit: Joi.number().min(1).default(50),
    }),
  }),
};
