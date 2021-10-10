const Joi = require("joi");
const { commonValidators } = require("../../utils");
const db = require("../../database").models;

module.exports = {
  paramId: commonValidators.paramId,

  create: Joi.object({
    body: Joi.object({
      tableId: Joi.number().integer().required(),
      dishes: Joi.array().items(
        Joi.object({
          id: Joi.number().required(),
          amount: Joi.number().integer().required(),
          note: Joi.string(),
        })
      ),
    }).required(),
  }),

  update: Joi.object({
    params: Joi.object({
      id: Joi.number().min(1).required(),
    }),
    body: Joi.object({
      amount: Joi.number().integer().required(),
      note: Joi.string(),
      status: Joi.string().valid(db.Order.STATUS.canceled),
    }).required(),
  }),

  updateStatus: Joi.object({
    params: Joi.object({
      id: Joi.number().min(1).required(),
    }),
    body: Joi.object({
      status: Joi.string()
        .valid(..._.values(db.Order.STATUS))
        .required(),
    }).required(),
  }),

  getAll: Joi.object({
    query: Joi.object({
      ...commonValidators.pagination,
      categoryId: commonValidators.idArray.required(),
      from: Joi.date(),
      to: Joi.date(),
      status: Joi.alternatives().try(
        Joi.array().items(Joi.string().valid(..._.values(db.Order.STATUS))),
        Joi.string().valid(..._.values(db.Order.STATUS))
      ),
    }),
  }),

  getStatusCount: Joi.object({
    query: Joi.object({
      from: Joi.date(),
      to: Joi.date(),
      menuId: Joi.number().integer().min(1),
    }),
  }),
};
