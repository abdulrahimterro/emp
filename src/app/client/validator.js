const Joi = require("joi");
const { commonValidators } = require("../../utils");
const db = require("../../database").models;

module.exports = {
  paramId: commonValidators.paramId,

  create: Joi.object({
    body: Joi.object({}).required(),
  }),

  update: Joi.object({
    params: Joi.object({
      id: Joi.number().min(1).required(),
    }),
    body: Joi.object({}).required(),
  }),

  getAll: Joi.object({
    query: Joi.object({
      ...commonValidators.pagination,
      menuId: Joi.number().integer().min(1).required(),
      from: Joi.date(),
      to: Joi.date(),
    }),
  }),
};
