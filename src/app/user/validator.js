const Joi = require("joi");
const { commonValidators } = require("../../utils");
const db = require("../../database").models;

module.exports = {
  paramId: commonValidators.paramId,

  invite: Joi.object({
    body: Joi.object({
      permissionId: Joi.number().integer().min(1).required(),
      menuId: Joi.number().integer().min(1).required(),
      to: Joi.string().required(),
    }),
  }),

  update: Joi.object({
    paramId: commonValidators.paramId,
    body: Joi.object({
      status: Joi.string().valid(..._.values(db.User.STATUS)),
      permissions: Joi.array().items(Joi.number().integer().min(1)),
      menus: Joi.array().items(Joi.number().integer().min(1)),
    }).required(),
  }),

  getAll: Joi.object({
    query: Joi.object({
      ...commonValidators.pagination,
      permissionId: Joi.alternatives().try(Joi.array().items(Joi.number()), Joi.number()),
      firstName: Joi.string(),
      lastName: Joi.string(),
      status: Joi.string().valid(..._.values(db.User.STATUS)),
    }),
  }),

  updateProfile: Joi.object({
    body: Joi.object({
      firstName: Joi.string(),
      lastName: Joi.string(),
      email: Joi.string().email(),
      phone: Joi.string(),
      birthDate: Joi.date(),
      address: Joi.string(),
      avatar: Joi.string().valid("null"),
      password: Joi.object().keys({
        old: commonValidators.password,
        new: commonValidators.password,
      }),
    }).required(),
  }),
};
