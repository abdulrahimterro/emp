const Joi = require("joi");
const { commonValidators } = require("../../utils");
const db = require("../../database").models;

module.exports = {
  paramId: commonValidators.paramId,

  update: Joi.object({
    params: Joi.object({
      id: Joi.number().min(1).required(),
    }).required(),
    body: Joi.object({
      status: Joi.string().valid(..._.values(db.Table.STATUS)),
    }),
  }),

  checkoutOrHelp: Joi.object({
    params: Joi.object({
      id: Joi.number().min(1).required(),
    }).required(),
    body: Joi.object({
      status: Joi.string().valid(db.Table.STATUS.checkout, db.Table.STATUS.help, db.Table.STATUS.busy),
    }),
  }),

  getByCode: Joi.object({
    params: Joi.object({
      code: Joi.string().uuid().required(),
    }).required(),
  }),

  getAll: Joi.object({
    query: Joi.object({
      ...commonValidators.pagination,
      menuId: Joi.number().required(),
      status: Joi.string().valid(..._.values(db.Table.STATUS)),
    }),
  }),
};
